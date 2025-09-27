<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;
use App\Models\Interview;
use App\Models\Transcript;

class AiController extends Controller
{
    public function ask(Request $r)
    {
        $data = $r->validate([
            'interview_id' => 'required|integer|exists:interviews,id',
            'user_text'    => 'required|string|min:2',
        ]);

        $interview = Interview::with(['transcripts' => function ($q) {
            $q->orderBy('id');
        }])->findOrFail($data['interview_id']);

        // ----- FREE CAP ENFORCEMENT (before saving new user turn) -----
        $caps = $this->checkFreeCaps($interview);
        if ($caps['limited']) {
            return response()->json([
                'error'  => 'Free limit reached',
                'detail' => $caps['reason'], // "time" | "turns"
                'limit'  => $caps['limit'],  // { max_seconds, max_user_turns, elapsed_seconds, user_turns }
            ], 402); // Payment Required
        }

        // Save user turn (so nothing is lost)
        Transcript::create([
            'interview_id' => $interview->id,
            'speaker'      => 'user',
            'text'         => trim($data['user_text']),
            'ts_ms'        => now()->getTimestampMs(),
        ]);

        // Build system + compact context (last 6 turns)
        $system = $interview->meta['prompt'] ?? $this->defaultPrompt($interview);
        $last = $interview->transcripts
            ->take(-6)
            ->map(fn ($t) => [
                'role'    => $t->speaker === 'ai' ? 'assistant' : 'user',
                'content' => $t->text,
            ])->values()->all();

        // -------- OpenAI only (stable) --------
        $apiKey = env('OPENAI_API_KEY');
        if (!$apiKey) {
            return response()->json(['error' => 'Missing OPENAI_API_KEY'], 500);
        }

        try {
            $resp = Http::timeout(12)->retry(1, 200)
                ->withToken($apiKey)
                ->post('https://api.openai.com/v1/chat/completions', [
                    'model' => 'gpt-4o-mini',
                    'messages' => array_merge(
                        [['role' => 'system', 'content' => $system]],
                        $last,
                        [['role' => 'user', 'content' => trim($data['user_text'])]]
                    ),
                    'temperature' => 0.6,
                    'max_tokens'  => 160,
                ]);

            if (!$resp->ok()) {
                Log::error('OpenAI error', ['status' => $resp->status(), 'body' => $resp->body()]);
                return response()->json([
                    'error'  => 'AI provider error',
                    'detail' => $this->safeJson($resp->json()) ?: $resp->body(),
                ], $resp->status() ?: 502);
            }

            $text = $resp->json('choices.0.message.content') ?? '...';

        } catch (\Throwable $e) {
            Log::error('AI ask fatal', ['ex' => $e]);
            return response()->json(['error' => 'Server error contacting AI'], 502);
        }

        // Save AI response
        Transcript::create([
            'interview_id' => $interview->id,
            'speaker'      => 'ai',
            'text'         => $text,
            'ts_ms'        => now()->getTimestampMs(),
        ]);

        return ['text' => $text];
    }

    /**
     * Enforce free caps for users on plan 'free'.
     * Caps:
     *  - seconds since first transcript (based on ts_ms)
     *  - number of user turns (speaker='user')
     */
    private function checkFreeCaps(Interview $interview): array
    {
        // If there's no 'plan' column on users, treat as 'free' for now.
        $hasPlan = Schema::hasColumn('users', 'plan');
        $user = $interview->user ?? null; // if relation exists
        $plan = ($hasPlan && $user) ? ($user->plan ?? 'free') : 'free';

        if ($plan !== 'free') {
            return ['limited' => false];
        }

        $maxUserTurns = (int) env('FREE_MAX_USER_TURNS', 5);
        $maxSeconds   = (int) env('FREE_MAX_SECONDS', 60);

        // Count user turns so far
        $userTurns = $interview->transcripts->where('speaker', 'user')->count();

        // Compute elapsed time since the very first transcript (user or ai)
        $firstTs = $interview->transcripts->min('ts_ms');
        $elapsedSeconds = $firstTs ? max(0, (now()->getTimestampMs() - $firstTs) / 1000) : 0;

        if ($userTurns >= $maxUserTurns) {
            return [
                'limited' => true,
                'reason'  => 'turns',
                'limit'   => [
                    'max_user_turns' => $maxUserTurns,
                    'max_seconds'    => $maxSeconds,
                    'user_turns'     => $userTurns,
                    'elapsed_seconds'=> (int) $elapsedSeconds,
                ],
            ];
        }

        if ($elapsedSeconds >= $maxSeconds) {
            return [
                'limited' => true,
                'reason'  => 'time',
                'limit'   => [
                    'max_user_turns' => $maxUserTurns,
                    'max_seconds'    => $maxSeconds,
                    'user_turns'     => $userTurns,
                    'elapsed_seconds'=> (int) $elapsedSeconds,
                ],
            ];
        }

        return ['limited' => false];
    }

    private function defaultPrompt($interview): string
    {
        $role  = $interview->role ?? 'Software Engineer';
        $diff  = $interview->difficulty ?? 'medium';
        $meta  = $interview->meta ?? [];
        $stack = $meta['tech_stack'] ?? 'React, Laravel, MySQL';

        return "You are a professional interviewer for a {$role} role.
Difficulty: {$diff}. Focus on {$stack}.
Interview style: concise, Socratic, one question at a time. Use STAR follow-ups.
Keep answers short.";
    }

    private function safeJson($value)
    {
        try { return json_encode($value, JSON_UNESCAPED_SLASHES); } catch (\Throwable $e) { return null; }
    }
}
