<?php

namespace Database\Seeders;

use App\Models\VendorCategory;
use Illuminate\Database\Seeder;

class VendorCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Event Venues',
                'description' => 'Venues and spaces for hosting events.',
            ],
            [
                'name' => 'Caterers',
                'description' => 'Food and catering services for events.',
            ],
            [
                'name' => 'Decorations',
                'description' => 'Event decoration and styling services.',
            ],
            [
                'name' => 'Photography & Videography',
                'description' => 'Professional photography and videography services.',
            ],
            [
                'name' => 'Event Management',
                'description' => 'Professional event planning and management services.',
            ],
            [
                'name' => 'Music & Entertainment',
                'description' => 'Music, DJs, performers, and entertainment services.',
            ],
        ];

        foreach ($categories as $category) {
            VendorCategory::updateOrCreate(
                ['name' => $category['name']],
                $category
            );
        }
    }
}