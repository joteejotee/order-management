<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use App\Models\Order;

class OrderSeeder extends Seeder
{
  public function run(): void
  {
    DB::table('orders')->truncate();
    $now = Carbon::now();

    // ───────────────────────────
    // ① 今週の売れ筋TOP5（今週の各日に最大5件）
    // ───────────────────────────
    for ($i = 0; $i < min(5, $now->day); $i++) {
      $orderday = $now->copy()
        ->startOfWeek()
        ->addDays($i)
        ->setTime(12, 0, 0)
        ->format('Y-m-d H:i:s');

      Order::factory()
        ->withOrderday($orderday)
        ->state([
          'shipping' => 1,
          'num'      => $this->getBalancedQuantity(2, 4) * 5,
          # 'num'      => $this->getBalancedQuantity(1, 3) * 2,
          'pen_id'   => ($i % 10) + 1,
        ])
        ->create();
    }


    // ───────────────────────────
    // ② 週別売上（過去8週分、ただし今月内の週のみ）
    // ───────────────────────────
    for ($weekOffset = 1; $weekOffset <= 8; $weekOffset++) {
      $weekStart = $now->copy()->startOfWeek()->subWeeks($weekOffset);

      // ← ここで「週の開始日が今月以外ならスキップ」
      if ($weekStart->month !== $now->month) {
        continue;
      }

      $orderCount = $this->getBalancedQuantity(3, 7);

      for ($j = 0; $j < $orderCount; $j++) {
        $orderday = $weekStart->copy()
          ->addDays($j % 5)
          ->setTime(12, 0, 0)
          ->format('Y-m-d H:i:s');

        Order::factory()
          ->withOrderday($orderday)
          ->state([
            'shipping' => 1,
            'num'      => $this->getBalancedQuantity(2, 3) * 5,
            'pen_id'   => (($weekOffset + $j) % 10) + 1,
          ])
          ->create();
      }
    }


    // ───────────────────────────
    // ③ 月別売上（当月と前月を除く）
    // ───────────────────────────
    $standard = 3; // 各月の標準件数

    for ($monthOffset = 0; $monthOffset < 12; $monthOffset++) {
      if ($monthOffset === 0) {
        continue;
      }

      $monthDate = $now->copy()->startOfMonth()->subMonths($monthOffset);
      $orderCount = $standard;

      for ($j = 0; $j < $orderCount; $j++) {
        $day = $j === 0 ? 5 : 15;
        $day = min($day, $monthDate->copy()->endOfMonth()->day);

        $orderday = $monthDate->copy()
          ->setDay($day)
          ->setTime(12, 0, 0)
          ->format('Y-m-d H:i:s');

        Order::factory()
          ->withOrderday($orderday)
          ->state([
            'shipping' => 1,
            'num'      => $this->getBalancedQuantity(5, 12) * 10, // ← 数量を10倍
            'pen_id'   => (($monthOffset + $j) % 10) + 1,
          ])
          ->create();
      }
    }
  }

  /**
   * 適度にバラつきのある数量を生成
   */
  private function getBalancedQuantity(int $min, int $max): int
  {
    return fake()->numberBetween($min, $max);
  }
}
