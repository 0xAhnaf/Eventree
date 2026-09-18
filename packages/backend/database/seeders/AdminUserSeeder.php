<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@eventree.test'],
            [
                'name' => 'Eventree Admin',
                'phone' => null,
                'password' => 'Admin123!',
                'role' => 'admin',
                'email_verified_at' => now(),
            ]
        );
    }
}
