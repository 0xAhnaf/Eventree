<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\GoogleAuthController;

use App\Mail\TestGatewayEmail;
use Illuminate\Support\Facades\Mail;

use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;

Route::post('/register', [\App\Http\Controllers\AuthController::class, 'register']);
Route::post('/login', [\App\Http\Controllers\AuthController::class, 'login']);
Route::post('/auth/google/callback', [GoogleAuthController::class, 'handleGoogleCallback']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::post('/logout', [\App\Http\Controllers\AuthController::class, 'logout']);

    Route::get('/email/verify/{id}/{hash}', function (EmailVerificationRequest $request) {
    $request->fulfill();

    return response()->json(['message' => 'Email verified successfully!']);})->middleware('signed')->name('verification.verify');

    Route::post('/email/verification-notification', function (Request $request) {
        $request->user()->sendEmailVerificationNotification();

        return response()->json(['message' => 'Verification link sent!']);
    })->middleware('throttle:6,1');
});

Route::post('/forgot-password', function (Request $request) {
    $request->validate(['email' => 'required|email']);

    $status = Password::sendResetLink($request->only('email'));

    return $status === Password::RESET_LINK_SENT
        ? response()->json(['message' => 'Password reset link sent to your inbox.'])
        : response()->json(['error' => 'Unable to send reset link.'], 400);
});

Route::post('/reset-password', function (Request $request) {
    $request->validate([
        'token' => 'required',
        'email' => 'required|email',
        'password' => 'required|min:8|confirmed',
    ]);

    $status = Password::reset(
        $request->only('email', 'password', 'password_confirmation', 'token'),
        function ($user, $password) {
            $user->forceFill(['password' => Hash::make($password)])->save();
            event(new PasswordReset($user));
        }
    );

    return $status === Password::PASSWORD_RESET
        ? response()->json(['message' => 'Password has been reset successfully.'])
        : response()->json(['error' => 'Invalid or expired token.'], 400);
});

Route::get('/v1/test-email', function () {
    Mail::to('test@example.com')->queue(new TestGatewayEmail());

    return response()->json([
        'status' => 'success',
        'message' => 'Test email queued successfully!'
    ]);
});
