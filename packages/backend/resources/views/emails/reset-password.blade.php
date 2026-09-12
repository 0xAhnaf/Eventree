<x-mail::message>
# Reset your password

Hi {{ $name }},

We received a request to reset the password for your {{ config('app.name') }} account. Click the button below to choose a new one.

<x-mail::button :url="$resetUrl">
Reset Password
</x-mail::button>

This password reset link will expire soon. If you didn't request a password reset, you can safely ignore this email — your password will remain unchanged.

Thanks,<br>
The {{ config('app.name') }} Team
</x-mail::message>
