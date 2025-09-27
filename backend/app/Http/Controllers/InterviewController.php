<?php
namespace App\Http\Controllers;
use App\Models\Interview; use App\Models\Transcript; use App\Models\EventLog;
use Illuminate\Http\Request; use App\Services\PromptBuilder;

class InterviewController extends Controller {
    public function index(Request $r){
        $items = Interview::where('user_id', optional($r->user())->id)
            ->latest()->paginate(20);
        return $items;
    }

    public function store(Request $r){
        $data = $r->validate([
            'role' => 'nullable|string',
            'difficulty' => 'nullable|string',
            'mode' => 'nullable|string', // 'voice_browser' | 'voice_live'
            'experience_years' => 'nullable|integer',
            'tech_stack' => 'nullable|string',
            'company_type' => 'nullable|string',
            'focus_areas' => 'nullable|array',
            'language' => 'nullable|string',
            'length_minutes' => 'nullable|integer',
        ]);

        $prompt = PromptBuilder::make($data);
        $meta = $data; $meta['prompt'] = $prompt;

        $itv = Interview::create([
            'user_id' => optional($r->user())->id,
            'role' => $data['role'] ?? null,
            'difficulty' => $data['difficulty'] ?? 'medium',
            'started_at' => now(),
            'meta' => $meta,
        ]);
        return ['interview' => $itv];
    }

    public function show(Interview $interview){
        $interview->load(['transcripts','events']);
        return $interview;
    }

    public function appendTranscript(Request $r, Interview $interview){
        $data = $r->validate([
            'speaker' => 'required|in:ai,user',
            'text' => 'required|string',
            'ts_ms' => 'nullable|integer'
        ]);
        return Transcript::create(['interview_id'=>$interview->id] + $data);
    }

    public function finish(Request $r, Interview $interview){
        $data = $r->validate(['rubric_json' => 'nullable|array']);
        $interview->ended_at = now();
        $interview->duration_sec = $interview->started_at ? $interview->started_at->diffInSeconds($interview->ended_at) : null;
        $userWords = Transcript::where('interview_id',$interview->id)->where('speaker','user')->pluck('text')->implode(' ');
        $score = min(100, max(40, intdiv(str_word_count($userWords), 3)));
        $interview->score_overall = $score;
        if(isset($data['rubric_json'])) $interview->rubric_json = $data['rubric_json'];
        $interview->save();
        return $interview->fresh(['transcripts']);
    }
}