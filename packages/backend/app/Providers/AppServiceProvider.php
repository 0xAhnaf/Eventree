<?php

namespace App\Providers;

use App\Mail\PasswordResetEmail;
use App\Mail\EmailVerificationEmail;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        // Use the Eventree brand theme for every markdown mailable by default.
        config(['mail.markdown.theme' => 'eventree']);

        ResetPassword::createUrlUsing(function ($user, string $token) {
            return config('app.frontend_url') . '/reset-password?token=' . $token . '&email=' . urlencode($user->email);
        });

        // Swap Laravel's default plain notification emails for our branded mailables.
        ResetPassword::toMailUsing(function ($notifiable, string $token) {
            $url = config('app.frontend_url') . '/reset-password?token=' . $token . '&email=' . urlencode($notifiable->getEmailForPasswordReset());

            return (new PasswordResetEmail($notifiable, $url))->to($notifiable->getEmailForPasswordReset());
        });

        VerifyEmail::toMailUsing(function ($notifiable, string $url) {
            return (new EmailVerificationEmail($notifiable, $url))->to($notifiable->getEmailForVerification());
        });
    }
}