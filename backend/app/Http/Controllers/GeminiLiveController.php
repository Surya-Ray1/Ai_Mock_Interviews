<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;

class GeminiLiveController extends Controller {
    public function createSession(Request $r){
        // TODO: Implement Google Gemini Live WebRTC session creation.
        // This typically returns a descriptor/answer for the browser's SDP offer
        // or an ephemeral session token depending on the chosen integration path.
        // Keep your GOOGLE_API_KEY in .env and never expose it to the client.
        return response()->json([
            'ok' => false,
            'message' => 'Gemini Live not configured yet. Add GOOGLE_API_KEY and implement session creation.'
        ], 501);
    }
}