<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Order>
 */
class OrderFactory extends Factory
{
  /**
   * Define the model's default state.
   *
   * @return array<string, mixed>
   */
  public function definition(): array
  {
    return [
      'customer_id' => $this->faker->numberBetween($min = 1, $max = 3),
      'pen_id' => $this->faker->numberBetween($min = 1, $max = 10),
      'num' => $this->faker->numberBetween($min = 1, $max = 20),
      'orderday' => date('Y-m-d H:i:s'),
    ];
  }
}
