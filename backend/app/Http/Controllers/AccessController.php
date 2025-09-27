<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\InviteCode;

class AccessController extends Controller
{
    public function redeem(Request $r) {
        $data = $r->validate(['code' => 'required|string']);
        $code = InviteCode::where('code', $data['code'])->first();

        if (!$code || !$code->canUse()) {
            return response()->json(['error' => 'Invalid or expired code'], 422);
        }

        $u = $r->user();
        $u->plan = 'pro';
        $u->save();

        $code->increment('used');

        return ['ok' => true, 'plan' => $u->plan];
    }

    // Minimal admin endpoint protected by header X-Admin-Key
    public function create(Request $r) {
        $adminKey = $r->header('X-Admin-Key');
        if (!$adminKey || $adminKey !== env('ADMIN_KEY')) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $data = $r->validate([
            'code' => 'required|string|unique:invite_codes,code',
            'max_uses' => 'nullable|integer|min:1',
            'expires_at' => 'nullable|date'
        ]);

        $code = InviteCode::create([
            'code' => $data['code'],
            'max_uses' => $data['max_uses'] ?? 1,
            'expires_at' => $data['expires_at'] ?? null,
        ]);

        return $code;
    }
}
