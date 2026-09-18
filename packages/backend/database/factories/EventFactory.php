<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class EventFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'title' => fake()->words(3, true) . "'s Event",
            'category' => fake()->randomElement(['Wedding', 'Birthday', 'Corporate']),
            'status' => fake()->randomElement(['Planning', 'Confirmed', 'Past']),
            'date' => fake()->dateTimeBetween('-2 months', '+6 months'),
            'location' => fake()->city() . ', Dhaka',
            'guests' => fake()->numberBetween(20, 400),
            'budget' => fake()->numberBetween(50000, 600000),
            'image' => null,
        ];
    }
}
