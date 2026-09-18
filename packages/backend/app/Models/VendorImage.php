<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VendorImage extends Model
{
    protected $fillable = [
        'vendor_profile_id',
        'image_type',
        'image_url',
        'public_id',
        'sort_order',
    ];

    public function vendorProfile(): BelongsTo
    {
        return $this->belongsTo(VendorProfile::class);
    }
}