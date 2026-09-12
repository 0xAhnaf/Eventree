<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PasswordResetEmail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(public $user, public string $resetUrl)
    {
        //
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Reset your ' . config('app.name') . ' password',
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.reset-password',
            with: [
                'name' => $this->user->name,
                'resetUrl' => $this->resetUrl,
            ],
        );
    }
}
