<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Pen>
 */
class PenFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->words(2, true) . ' ペン',
            'price' => $this->faker->numberBetween(100, 2000),
            'stock' => $this->faker->numberBetween(0, 100),
        ];
    }
}
