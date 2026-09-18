<x-mail::message>
# Welcome to {{ config('app.name') }}! 🎉

Hi {{ $user->name }},

We're thrilled to have you on board. {{ config('app.name') }} makes it easy to plan events and connect with the vendors you need — from photographers to caterers, all in one place.

Here's how to get started:

<x-mail::panel>
1. **Verify your email** so we know it's really you.
2. **Complete your profile** to personalize your experience.
3. **Browse vendors** or start planning your first event.
</x-mail::panel>

<x-mail::button :url="config('app.frontend_url')">
Go to My Dashboard
</x-mail::button>

If you have any questions along the way, just reply to this email — we're happy to help.

Thanks,<br>
The {{ config('app.name') }} Team
</x-mail::message>
