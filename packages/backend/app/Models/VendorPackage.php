<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VendorPackage extends Model
{
    protected $fillable = [
        'vendor_profile_id',
        'package_name',
        'description',
        'price',
        'sort_order',
    ];

    public function vendorProfile(): BelongsTo
    {
        return $this->belongsTo(VendorProfile::class);
    }
}