<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\InterviewController;
use App\Http\Controllers\AiController;
use App\Http\Controllers\AccessController;
use App\Http\Controllers\PaymentController;

Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/google', [AuthController::class, 'google']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/billing/razorpay/order',  [PaymentController::class, 'createRazorpayOrder']);
Route::post('/billing/razorpay/verify', [PaymentController::class, 'verifyRazorpay']);
    Route::post('/access/redeem', [AccessController::class, 'redeem']);
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    Route::get('/sessions', [InterviewController::class, 'index']);
    Route::post('/sessions', [InterviewController::class, 'store']);
    Route::get('/sessions/{interview}', [InterviewController::class, 'show']);
    Route::post('/sessions/{interview}/transcripts', [InterviewController::class, 'appendTranscript']);
    Route::post('/sessions/{interview}/finish', [InterviewController::class, 'finish']);

    Route::post('/ai/ask', [AiController::class, 'ask']);

    // NEW: invite/unlock
    Route::post('/access/redeem', [AccessController::class, 'redeem']);
});

Route::get('/health', fn() => ['status' => 'ok']);
Route::post('/access/admin/create-code', [AccessController::class, 'create']);