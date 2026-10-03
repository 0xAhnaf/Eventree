<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\VendorAmenity;
use App\Models\VendorCategory;
use App\Models\VendorImage;
use App\Models\VendorPackage;
use App\Models\VendorProfile;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DemoVendorSeeder extends Seeder
{
    public function run(): void
    {
        $this->call(VendorCategorySeeder::class);

        $vendors = [

            // =========================================================
            // EVENT VENUES
            // =========================================================

            [
                'login_email' => 'eventvenue1@eventree.test',
                'name' => 'Royal Orchid Convention Hall',
                'owner' => 'Arif Hossain',
                'category' => 'Event Venues',
                'city' => 'Dhaka',
                'address' => 'House 21, Road 7, Dhanmondi, Dhaka',
                'phone' => '01710000001',
                'description' => 'An elegant event venue in Dhaka suitable for weddings, receptions, corporate programs and private celebrations.',
                'manager' => 'Arif Hossain',
                'experience' => 9,
                'events' => 340,
                'starting_price' => 75000,
                'amenities' => [
                    'Air Conditioning',
                    'Parking',
                    'Generator Backup',
                    'Bridal Room',
                    'Stage',
                    'Security',
                ],
                'packages' => [
                    [
                        'Classic Venue',
                        'Venue access, seating arrangement and basic stage setup.',
                        75000
                    ],
                    [
                        'Premium Venue',
                        'Venue, premium seating, decorated stage and bridal room.',
                        120000
                    ],
                    [
                        'Royal Venue',
                        'Full venue setup, premium decor support, lighting and dedicated coordinator.',
                        180000
                    ],
                ],
            ],

            [
                'login_email' => 'eventvenue2@eventree.test',
                'name' => 'Lakeview Grand Hall',
                'owner' => 'Nafisa Rahman',
                'category' => 'Event Venues',
                'city' => 'Dhaka',
                'address' => 'Road 11, Sector 4, Uttara, Dhaka',
                'phone' => '01710000002',
                'description' => 'A spacious modern venue designed for weddings, engagements, corporate dinners and large family events.',
                'manager' => 'Nafisa Rahman',
                'experience' => 7,
                'events' => 265,
                'starting_price' => 65000,
                'amenities' => [
                    'Air Conditioning',
                    'Car Parking',
                    'Lift Access',
                    'Generator Backup',
                    'Changing Room',
                    'Sound System',
                ],
                'packages' => [
                    [
                        'Essential Hall',
                        'Hall rental with standard seating and stage.',
                        65000
                    ],
                    [
                        'Celebration Hall',
                        'Hall rental, upgraded stage, lighting and seating.',
                        105000
                    ],
                    [
                        'Signature Hall',
                        'Premium venue setup with lighting, stage styling and event support.',
                        155000
                    ],
                ],
            ],

            // =========================================================
            // CATERERS
            // =========================================================

            [
                'login_email' => 'caterer1@eventree.test',
                'name' => 'Dhaka Feast Catering',
                'owner' => 'Mahmud Hasan',
                'category' => 'Caterers',
                'city' => 'Dhaka',
                'address' => 'Green Road, Panthapath, Dhaka',
                'phone' => '01710000003',
                'description' => 'Professional catering service offering Bengali, Mughlai and contemporary menus for weddings and corporate events.',
                'manager' => 'Mahmud Hasan',
                'experience' => 11,
                'events' => 520,
                'starting_price' => 650,
                'amenities' => [
                    'Buffet Service',
                    'Professional Servers',
                    'Custom Menu',
                    'Live Counter',
                    'Table Setup',
                    'Food Tasting',
                ],
                'packages' => [
                    [
                        'Classic Menu',
                        'Rice, chicken, beef, salad, soft drink and dessert per guest.',
                        650
                    ],
                    [
                        'Premium Menu',
                        'Polao, roast, beef, kebab, salad, drinks and dessert per guest.',
                        950
                    ],
                    [
                        'Royal Menu',
                        'Premium multi-course menu with live counter and desserts per guest.',
                        1350
                    ],
                ],
            ],

            [
                'login_email' => 'caterer2@eventree.test',
                'name' => 'TasteCraft Events',
                'owner' => 'Sadia Islam',
                'category' => 'Caterers',
                'city' => 'Chattogram',
                'address' => 'GEC Circle, Chattogram',
                'phone' => '01710000004',
                'description' => 'Event catering team providing customizable menus, professional service and complete food presentation.',
                'manager' => 'Sadia Islam',
                'experience' => 6,
                'events' => 210,
                'starting_price' => 550,
                'amenities' => [
                    'Buffet Setup',
                    'Custom Menu',
                    'Serving Staff',
                    'Live Cooking',
                    'Dessert Station',
                ],
                'packages' => [
                    [
                        'Silver Menu',
                        'Standard Bengali menu with dessert per guest.',
                        550
                    ],
                    [
                        'Gold Menu',
                        'Expanded menu with kebab, drinks and premium dessert per guest.',
                        850
                    ],
                    [
                        'Platinum Menu',
                        'Premium menu with live station and full buffet service per guest.',
                        1250
                    ],
                ],
            ],

            // =========================================================
            // DECORATIONS
            // =========================================================

            [
                'login_email' => 'decoration1@eventree.test',
                'name' => 'DreamCanvas Decor',
                'owner' => 'Tasnim Ahmed',
                'category' => 'Decorations',
                'city' => 'Dhaka',
                'address' => 'Bashundhara R/A, Dhaka',
                'phone' => '01710000005',
                'description' => 'Creative event decoration studio specializing in wedding stages, floral styling, lighting and themed celebrations.',
                'manager' => 'Tasnim Ahmed',
                'experience' => 8,
                'events' => 310,
                'starting_price' => 35000,
                'amenities' => [
                    'Floral Decoration',
                    'Stage Design',
                    'Lighting',
                    'Entrance Decor',
                    'Table Decor',
                    'Custom Theme',
                ],
                'packages' => [
                    [
                        'Simple Elegance',
                        'Basic stage, entrance and table decoration.',
                        35000
                    ],
                    [
                        'Signature Decor',
                        'Floral stage, entrance styling, lighting and table decor.',
                        75000
                    ],
                    [
                        'Luxury Theme',
                        'Custom premium theme with complete venue styling and lighting.',
                        140000
                    ],
                ],
            ],

            [
                'login_email' => 'decoration2@eventree.test',
                'name' => 'Petal & Glow',
                'owner' => 'Mehjabin Chowdhury',
                'category' => 'Decorations',
                'city' => 'Dhaka',
                'address' => 'Banani, Dhaka',
                'phone' => '01710000006',
                'description' => 'Boutique decor service creating elegant floral arrangements, modern stages and personalized event themes.',
                'manager' => 'Mehjabin Chowdhury',
                'experience' => 5,
                'events' => 175,
                'starting_price' => 30000,
                'amenities' => [
                    'Fresh Flowers',
                    'Stage Styling',
                    'Photo Booth',
                    'Ambient Lighting',
                    'Welcome Board',
                ],
                'packages' => [
                    [
                        'Bloom',
                        'Simple floral stage and welcome decoration.',
                        30000
                    ],
                    [
                        'Glow',
                        'Floral stage, entrance, photo area and ambient lighting.',
                        65000
                    ],
                    [
                        'Grand Bloom',
                        'Complete premium theme and venue styling.',
                        125000
                    ],
                ],
            ],

            // =========================================================
            // PHOTOGRAPHY & VIDEOGRAPHY
            // =========================================================

            [
                'login_email' => 'photography1@eventree.test',
                'name' => 'FrameStory Studios',
                'owner' => 'Rafiul Karim',
                'category' => 'Photography & Videography',
                'city' => 'Dhaka',
                'address' => 'Lalmatia, Mohammadpur, Dhaka',
                'phone' => '01710000007',
                'description' => 'Wedding and event photography team focused on candid storytelling, cinematic films and professionally edited memories.',
                'manager' => 'Rafiul Karim',
                'experience' => 10,
                'events' => 430,
                'starting_price' => 25000,
                'amenities' => [
                    'Photography',
                    'Cinematography',
                    'Drone Coverage',
                    'Photo Album',
                    'Highlight Film',
                    'Online Gallery',
                ],
                'packages' => [
                    [
                        'Moments',
                        'One photographer with professionally edited event photos.',
                        25000
                    ],
                    [
                        'Story',
                        'Photography and cinematography with highlight film.',
                        50000
                    ],
                    [
                        'Cinema',
                        'Full team, cinematic film, drone coverage and premium album.',
                        85000
                    ],
                ],
            ],

            [
                'login_email' => 'photography2@eventree.test',
                'name' => 'ShutterBeat Films',
                'owner' => 'Imran Kabir',
                'category' => 'Photography & Videography',
                'city' => 'Sylhet',
                'address' => 'Zindabazar, Sylhet',
                'phone' => '01710000008',
                'description' => 'Creative photography and filmmaking service covering weddings, engagements and corporate events.',
                'manager' => 'Imran Kabir',
                'experience' => 6,
                'events' => 230,
                'starting_price' => 20000,
                'amenities' => [
                    'Event Photography',
                    'Video Coverage',
                    'Cinematic Edit',
                    'Couple Portraits',
                    'Digital Delivery',
                ],
                'packages' => [
                    [
                        'Capture',
                        'Event photography and edited digital delivery.',
                        20000
                    ],
                    [
                        'Highlight',
                        'Photography, video coverage and highlight film.',
                        42000
                    ],
                    [
                        'Complete Story',
                        'Full photo-video team with cinematic edit and album.',
                        70000
                    ],
                ],
            ],

            // =========================================================
            // EVENT MANAGEMENT
            // =========================================================

            [
                'login_email' => 'eventmanagement1@eventree.test',
                'name' => 'Celebration Architects',
                'owner' => 'Farhan Rahman',
                'category' => 'Event Management',
                'city' => 'Dhaka',
                'address' => 'Gulshan 1, Dhaka',
                'phone' => '01710000009',
                'description' => 'Full-service event management company handling planning, coordination, vendor management and event-day execution.',
                'manager' => 'Farhan Rahman',
                'experience' => 12,
                'events' => 610,
                'starting_price' => 50000,
                'amenities' => [
                    'Event Planning',
                    'Vendor Coordination',
                    'Budget Planning',
                    'Event Day Management',
                    'Guest Management',
                    'Timeline Planning',
                ],
                'packages' => [
                    [
                        'Essential Planning',
                        'Planning consultation and event-day coordination.',
                        50000
                    ],
                    [
                        'Complete Planning',
                        'Planning, vendor coordination, timeline and event management.',
                        95000
                    ],
                    [
                        'Signature Management',
                        'End-to-end premium event planning and execution.',
                        160000
                    ],
                ],
            ],

            [
                'login_email' => 'eventmanagement2@eventree.test',
                'name' => 'Moments & Milestones',
                'owner' => 'Nusrat Jahan',
                'category' => 'Event Management',
                'city' => 'Dhaka',
                'address' => 'Mirpur DOHS, Dhaka',
                'phone' => '01710000010',
                'description' => 'Event planning service for weddings, birthdays, corporate events and private celebrations.',
                'manager' => 'Nusrat Jahan',
                'experience' => 7,
                'events' => 285,
                'starting_price' => 40000,
                'amenities' => [
                    'Event Coordination',
                    'Vendor Management',
                    'Guest Support',
                    'Budget Management',
                    'Schedule Planning',
                ],
                'packages' => [
                    [
                        'Coordinate',
                        'Event-day coordination and schedule management.',
                        40000
                    ],
                    [
                        'Plan & Manage',
                        'Planning, vendor coordination and event management.',
                        80000
                    ],
                    [
                        'Full Experience',
                        'Complete event planning from concept to execution.',
                        135000
                    ],
                ],
            ],

            // =========================================================
            // MUSIC & ENTERTAINMENT
            // =========================================================

            [
                'login_email' => 'entertainment1@eventree.test',
                'name' => 'Rhythm Republic',
                'owner' => 'Adnan Samiul',
                'category' => 'Music & Entertainment',
                'city' => 'Dhaka',
                'address' => 'Bailey Road, Dhaka',
                'phone' => '01710000011',
                'description' => 'Professional DJ and live entertainment service providing music, sound and lighting for celebrations and corporate events.',
                'manager' => 'Adnan Samiul',
                'experience' => 8,
                'events' => 360,
                'starting_price' => 22000,
                'amenities' => [
                    'Professional DJ',
                    'Sound System',
                    'Dance Lighting',
                    'Wireless Microphones',
                    'Custom Playlist',
                ],
                'packages' => [
                    [
                        'DJ Essential',
                        'Professional DJ and standard sound system.',
                        22000
                    ],
                    [
                        'Party Plus',
                        'DJ, premium sound, microphones and dance lighting.',
                        40000
                    ],
                    [
                        'Concert Experience',
                        'Full entertainment setup with advanced sound and lighting.',
                        70000
                    ],
                ],
            ],

            [
                'login_email' => 'entertainment2@eventree.test',
                'name' => 'Encore Entertainment',
                'owner' => 'Samin Chowdhury',
                'category' => 'Music & Entertainment',
                'city' => 'Dhaka',
                'address' => 'Banasree, Dhaka',
                'phone' => '01710000012',
                'description' => 'Live music and entertainment provider for weddings, parties, cultural programs and corporate celebrations.',
                'manager' => 'Samin Chowdhury',
                'experience' => 6,
                'events' => 245,
                'starting_price' => 18000,
                'amenities' => [
                    'Live Music',
                    'DJ Service',
                    'Sound Setup',
                    'Stage Lighting',
                    'Host Support',
                ],
                'packages' => [
                    [
                        'Music Lite',
                        'DJ or acoustic performance with basic sound.',
                        18000
                    ],
                    [
                        'Live Celebration',
                        'Live performers with professional sound system.',
                        38000
                    ],
                    [
                        'Grand Entertainment',
                        'Full entertainment team, sound, DJ and lighting.',
                        65000
                    ],
                ],
            ],
        ];

        DB::transaction(function () use ($vendors) {

            foreach ($vendors as $index => $data) {

                $number = str_pad(
                    (string) ($index + 1),
                    2,
                    '0',
                    STR_PAD_LEFT
                );

                /*
                |--------------------------------------------------------------------------
                | Vendor User Account
                |--------------------------------------------------------------------------
                */

                $user = User::updateOrCreate(
                    [
                        'email' => $data['login_email'],
                    ],
                    [
                        'name' => $data['owner'],
                        'phone' => $data['phone'],
                        'password' => Hash::make('Vendor123!'),
                        'role' => 'vendor',
                        'email_verified_at' => now(),
                    ]
                );

                /*
                |--------------------------------------------------------------------------
                | Vendor Category
                |--------------------------------------------------------------------------
                */

                $category = VendorCategory::where(
                    'name',
                    $data['category']
                )->firstOrFail();

                /*
                |--------------------------------------------------------------------------
                | Registration Status
                |--------------------------------------------------------------------------
                */

                $monthOffset = $index % 6;

                $onboardingAt = now()
                    ->subMonths($monthOffset)
                    ->subDays($index + 5);

                $paymentAt = now()
                    ->subMonths($monthOffset)
                    ->subDays($index + 3);

                $approvedAt = now()
                    ->subMonths($monthOffset)
                    ->subDays($index + 2);

                /*
                |--------------------------------------------------------------------------
                | Vendor Profile
                |--------------------------------------------------------------------------
                */

                $profile = VendorProfile::updateOrCreate(
                    [
                        'user_id' => $user->id,
                    ],
                    [
                        'business_name' => $data['name'],
                        'category_id' => $category->id,
                        'description' => $data['description'],
                        'city' => $data['city'],
                        'full_address' => $data['address'],
                        'business_email' => $data['login_email'],
                        'phone' => $data['phone'],
                        'website' => "https://example.com/vendor-{$number}",
                        'manager_name' => $data['manager'],
                        'years_of_experience' => $data['experience'],
                        'events_completed' => $data['events'],
                        'starting_price' => $data['starting_price'],
                        'onboarding_completed_at' => $onboardingAt,
                        'registration_payment_completed_at' => $paymentAt,
                        'admin_approved_at' => $approvedAt,
                    ]
                );

                /*
                |--------------------------------------------------------------------------
                | Clear Existing Demo Details
                |--------------------------------------------------------------------------
                */

                $profile->forceFill([
                    'cover_image_id' => null,
                ])->save();

                $profile->images()->delete();
                $profile->amenities()->delete();
                $profile->packages()->delete();

                /*
                |--------------------------------------------------------------------------
                | Amenities
                |--------------------------------------------------------------------------
                */

                foreach ($data['amenities'] as $amenity) {

                    VendorAmenity::create([
                        'vendor_profile_id' => $profile->id,
                        'amenity_name' => $amenity,
                    ]);
                }

                /*
                |--------------------------------------------------------------------------
                | Packages
                |--------------------------------------------------------------------------
                */

                foreach ($data['packages'] as $packageIndex => $package) {

                    VendorPackage::create([
                        'vendor_profile_id' => $profile->id,
                        'package_name' => $package[0],
                        'description' => $package[1],
                        'price' => $package[2],
                        'sort_order' => $packageIndex,
                    ]);
                }

                /*
                |--------------------------------------------------------------------------
                | Cover Image
                |--------------------------------------------------------------------------
                */

                $cover = VendorImage::create([
                    'vendor_profile_id' => $profile->id,
                    'image_type' => 'cover',
                    'image_url' => "/demo-vendors/vendor-{$number}-cover.jpg",
                    'public_id' => "demo/vendors/vendor-{$number}/cover",
                    'sort_order' => 0,
                ]);

                /*
                |--------------------------------------------------------------------------
                | Portfolio Image 1
                |--------------------------------------------------------------------------
                */

                VendorImage::create([
                    'vendor_profile_id' => $profile->id,
                    'image_type' => 'portfolio',
                    'image_url' => "/demo-vendors/vendor-{$number}-portfolio-1.jpg",
                    'public_id' => "demo/vendors/vendor-{$number}/portfolio-1",
                    'sort_order' => 0,
                ]);

                /*
                |--------------------------------------------------------------------------
                | Portfolio Image 2
                |--------------------------------------------------------------------------
                */

                VendorImage::create([
                    'vendor_profile_id' => $profile->id,
                    'image_type' => 'portfolio',
                    'image_url' => "/demo-vendors/vendor-{$number}-portfolio-2.jpg",
                    'public_id' => "demo/vendors/vendor-{$number}/portfolio-2",
                    'sort_order' => 1,
                ]);

                /*
                |--------------------------------------------------------------------------
                | Select Cover Image
                |--------------------------------------------------------------------------
                */

                $profile->forceFill([
                    'cover_image_id' => $cover->id,
                ])->save();
            }
        });
    }
}