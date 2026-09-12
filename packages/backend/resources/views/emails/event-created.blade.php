<x-mail::message>
# Your event is set up! 🎉

Hi {{ $name }},

Your event has been created and is now visible in **My Events**. Here's a quick summary:

<x-mail::panel>
**{{ $event->title }}**<br>
📅 {{ $event->date?->format('d M Y') }}<br>
📍 {{ $event->location }}<br>
👥 {{ $event->guests }} guests<br>
💰 Budget: BDT {{ number_format($event->budget) }}
</x-mail::panel>

Next, start browsing vendors to bring this event to life — photographers, caterers, decorators and more, all in one place.

<x-mail::button :url="config('app.frontend_url') . '/my-events'">
View My Event
</x-mail::button>

Thanks,<br>
The {{ config('app.name') }} Team
</x-mail::message>
