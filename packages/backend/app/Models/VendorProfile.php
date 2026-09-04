<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class VendorProfile extends Model
{
    protected $fillable = [
        'user_id',
        'business_name',
        'category_id',
        'description',
        'city',
        'full_address',
        'business_email',
        'phone',
        'website',
        'manager_name',
        'years_of_experience',
        'events_completed',
        'starting_price',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(VendorCategory::class, 'category_id');
    }

    public function images(): HasMany
    {
        return $this->hasMany(VendorImage::class);
    }

    public function amenities(): HasMany
    {
        return $this->hasMany(VendorAmenity::class);
    }

    public function packages(): HasMany
    {
        return $this->hasMany(VendorPackage::class);
    }
}