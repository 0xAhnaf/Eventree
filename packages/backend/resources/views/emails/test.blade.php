<x-mail::message>
# Email Gateway Test ✅

Good news — your Laravel backend email gateway and background queue processing are working correctly!

<x-mail::panel>
This is an automated test message from {{ config('app.name') }}. No action is needed.
</x-mail::panel>

<x-mail::button :url="config('app.url')">
Visit Application
</x-mail::button>

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
