<x-mail::message>
# Welcome to {{ config('app.name') }}! 🎉

Hi {{ $user->name }}, we're excited to have you on board.

<x-mail::button :url="config('app.url')">
Visit Application
</x-mail::button>

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>