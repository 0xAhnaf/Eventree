<?php

use App\Http\Controllers\Auth\GoogleAuthController;
use App\Http\Controllers\Admin\AdminManagementController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\PublicVendorController;
use App\Http\Controllers\VendorAvailabilityController;
use App\Http\Controllers\VendorBookingController;
use App\Http\Controllers\VendorDetailsController;
use App\Http\Controllers\VendorProfileController;
use App\Http\Controllers\VendorRegistrationController;
use App\Mail\TestGatewayEmail;
use App\Models\User;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Auth\Events\Verified;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Route;

Route::post('/register', [\App\Http\Controllers\AuthController::class, 'register']);
Route::post('/login', [\App\Http\Controllers\AuthController::class, 'login']);
Route::post('/auth/google/callback', [GoogleAuthController::class, 'handleGoogleCallback']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::post('/logout', [\App\Http\Controllers\AuthController::class, 'logout']);

    Route::post('/email/verification-notification', function (Request $request) {
        $request->user()->sendEmailVerificationNotification();

        return response()->json(['message' => 'Verification link sent!']);
    })->middleware('throttle:6,1');

    // Vendor Profile & Details Routes
    Route::post('/vendor-profile', [VendorProfileController::class, 'store']);
    Route::get('/vendor-profile', [VendorProfileController::class, 'show']);
    Route::put('/vendor-profile', [VendorProfileController::class, 'update']);
    Route::post('/vendor-profile/cover-image', [VendorProfileController::class, 'updateCoverImage']);
    Route::put('/vendor-profile/cover-image/{image}', [VendorProfileController::class, 'selectCoverImage']);
    Route::post('/vendor-profile/portfolio-images', [VendorProfileController::class, 'addPortfolioImages']);
    Route::delete('/vendor-profile/images/{image}', [VendorProfileController::class, 'deleteImage']);

    Route::post('/vendor-details', [VendorDetailsController::class, 'store']);

    Route::post('/bookings', [VendorBookingController::class, 'store']);
    Route::get('/vendor/bookings', [VendorBookingController::class, 'index']);
    Route::patch('/vendor/bookings/{booking}/status', [VendorBookingController::class, 'updateStatus']);

    Route::get('/vendor/availability', [VendorAvailabilityController::class, 'show']);
    Route::put('/vendor/availability', [VendorAvailabilityController::class, 'update']);

    Route::get('/vendor/registration-status', [VendorRegistrationController::class, 'show']);
    Route::post('/vendor/registration-payment/complete', [VendorRegistrationController::class, 'completePayment']);

    // Event Routes
    Route::apiResource('events', EventController::class);

    Route::prefix('admin')->middleware('admin')->group(function () {
        Route::get('/dashboard', [AdminManagementController::class, 'dashboard']);
        Route::get('/customers', [AdminManagementController::class, 'customers']);
        Route::delete('/customers/{customer}', [AdminManagementController::class, 'destroyCustomer']);
        Route::get('/vendors', [AdminManagementController::class, 'vendors']);
        Route::patch('/vendors/{vendor}/approve', [AdminManagementController::class, 'approveVendor']);
        Route::delete('/vendors/{vendor}', [AdminManagementController::class, 'destroyVendor']);
        Route::get('/bookings', [AdminManagementController::class, 'bookings']);
        Route::get('/payments', [AdminManagementController::class, 'payments']);
        Route::get('/reports', [AdminManagementController::class, 'reports']);
    });
});

Route::get('/vendor-categories', function () {
    return response()->json(
        DB::table('vendor_categories')->select('id', 'name')->orderBy('name')->get()
    );
});

Route::get('/vendors', [PublicVendorController::class, 'index']);
Route::get('/vendors/{vendorProfile}/availability', [PublicVendorController::class, 'availability']);
Route::get('/vendors/{vendorProfile}', [PublicVendorController::class, 'show']);

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

Route::get('/email/verify/{id}/{hash}', function (Request $request, $id, $hash) {
    $user = User::find($id);

    if (! $user || ! hash_equals((string) $hash, sha1($user->getEmailForVerification()))) {
        return redirect(config('app.frontend_url') . '/verify-email?status=invalid');
    }

    if ($user->hasVerifiedEmail()) {
        return redirect(config('app.frontend_url') . '/verify-email?status=already');
    }

    $user->markEmailAsVerified();
    event(new Verified($user));

    return redirect(config('app.frontend_url') . '/verify-email?status=success');
})->middleware('signed')->name('verification.verify');

Route::get('/v1/test-email', function () {
    Mail::to('test@example.com')->queue(new TestGatewayEmail());

    return response()->json([
        'status' => 'success',
        'message' => 'Test email queued successfully!',
    ]);
});
