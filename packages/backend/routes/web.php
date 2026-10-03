<?php

use App\Http\Controllers\Payment\SslcommerzController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// SSLCommerz callbacks. Route names (sslc.*) match the defaults in
// config/sslcommerz.php; CSRF is exempted in bootstrap/app.php.
Route::prefix('sslcommerz')
    ->name('sslc.')
    ->controller(SslcommerzController::class)
    ->group(function () {
        Route::post('success', 'success')->name('success');
        Route::post('failure', 'failure')->name('failure');
        Route::post('cancel', 'cancel')->name('cancel');
        Route::post('ipn', 'ipn')->name('ipn');
    });


// Serve the React application for all non-API routes.
// React Router handles the frontend routes in the browser.
Route::get('/{any?}', function () {
    return response()->file(public_path('app/index.html'));
})->where('any', '(?!api/|sslcommerz/|up$).*');