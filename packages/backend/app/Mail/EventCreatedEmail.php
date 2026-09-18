<?php

namespace App\Mail;

use App\Models\Event;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class EventCreatedEmail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(public User $user, public Event $event)
    {
        //
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Your event "' . $this->event->title . '" has been created 🎉',
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.event-created',
            with: [
                'name' => $this->user->name,
                'event' => $this->event,
            ],
        );
    }
}
