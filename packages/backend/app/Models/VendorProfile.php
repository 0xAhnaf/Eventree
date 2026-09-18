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
        'onboarding_completed_at',
        'registration_payment_completed_at',
        'cover_image_id',
    ];

    protected function casts(): array
    {
        return [
            'onboarding_completed_at' => 'datetime',
            'registration_payment_completed_at' => 'datetime',
        ];
    }

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

    public function coverImage(): BelongsTo
    {
        return $this->belongsTo(VendorImage::class, 'cover_image_id');
    }

    public function amenities(): HasMany
    {
        return $this->hasMany(VendorAmenity::class);
    }

    public function packages(): HasMany
    {
        return $this->hasMany(VendorPackage::class);
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(VendorBooking::class);
    }

    public function blockedDates(): HasMany
    {
        return $this->hasMany(VendorBlockedDate::class);
    }
}
