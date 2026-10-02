<?php

return [
    // Server-side source of truth for the one-time vendor registration fee.
    // The frontend only displays it; the amount sent to SSLCommerz always
    // comes from here, never from the request.
    'registration_fee' => (float) env('VENDOR_REGISTRATION_FEE', 500),
    'currency' => env('SSLC_STORE_CURRENCY', 'BDT'),
];
