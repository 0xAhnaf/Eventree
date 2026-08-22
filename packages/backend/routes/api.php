<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\GoogleAuthController;

use App\Mail\TestGatewayEmail;
use Illuminate\Support\Facades\Mail;

Route::post('/register', [\App\Http\Controllers\AuthController::class, 'register']);
Route::post('/login', [\App\Http\Controllers\AuthController::class, 'login']);
Route::post('/auth/google/callback', [GoogleAuthController::class, 'handleGoogleCallback']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::post('/logout', [\App\Http\Controllers\AuthController::class, 'logout']);
});

Route::get('/v1/test-email', function () {
    Mail::to('test@example.com')->queue(new TestGatewayEmail());

    return response()->json([
        'status' => 'success',
        'message' => 'Test email queued successfully!'
    ]);
});
