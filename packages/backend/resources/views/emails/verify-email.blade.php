<x-mail::message>
# Verify your email address

Hi {{ $name }},

Thanks for signing up for {{ config('app.name') }}! Please confirm this is your email address by clicking the button below.

<x-mail::button :url="$verifyUrl">
Verify Email Address
</x-mail::button>

This link will expire soon for security reasons. If you didn't create an account with us, no further action is needed.

Thanks,<br>
The {{ config('app.name') }} Team
</x-mail::message>
