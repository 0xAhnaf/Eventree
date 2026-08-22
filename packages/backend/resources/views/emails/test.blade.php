<x-mail::message>
# Email Gateway Test

Your Laravel backend email gateway and background queue processing are working correctly!

<x-mail::button :url="config('app.url')">
Visit Application
</x-mail::button>

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>