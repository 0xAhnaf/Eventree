<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VendorBooking extends Model
{
    protected $fillable = [
        'vendor_profile_id',
        'customer_id',
        'vendor_package_id',
        'event_date',
        'event_type',
        'guests',
        'package_name',
        'package_price',
        'status',
        'active_date_key',
        'status_updated_at',
    ];

    protected function casts(): array
    {
        return [
            'event_date' => 'date',
            'guests' => 'integer',
            'package_price' => 'decimal:2',
            'status_updated_at' => 'datetime',
        ];
    }

    public function vendorProfile(): BelongsTo
    {
        return $this->belongsTo(VendorProfile::class);
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    public function vendorPackage(): BelongsTo
    {
        return $this->belongsTo(VendorPackage::class);
    }
}
