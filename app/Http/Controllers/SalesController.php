<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class SalesController extends Controller
{
    public function topWeekly()
    {
        $startOfWeek = now()->startOfWeek();
        $endOfWeek = now()->endOfWeek();

        $topProducts = \App\Models\Order::where('shipping', 1)
            ->whereBetween('orderday', [$startOfWeek, $endOfWeek])
            ->selectRaw('pen_id, SUM(num) as total_quantity')
            ->groupBy('pen_id')
            ->orderByDesc('total_quantity')
            ->with('pen')
            ->take(5)
            ->get()
            ->map(function ($order) {
                // 商品1個あたりの単価 × 総販売数 = 売上金額
                $salesAmount = $order->pen ? $order->pen->price * $order->total_quantity : 0;

                return [
                    'pen_id' => $order->pen_id,
                    'id' => $order->pen_id,
                    'name' => $order->pen->name ?? '',
                    'salesAmount' => $salesAmount,
                    'salesCount' => $order->total_quantity,
                ];
            });

        return response()->json($topProducts);
    }

    public function monthly()
    {
        $months = collect();

        // 1月から12月まで全ての月を表示
        for ($i = 1; $i <= 12; $i++) {
            $start = now()->setMonth($i)->setDay(1)->startOfDay();
            $end = $start->copy()->endOfMonth();

            // 現在の月より先の月はデータが無いので0を返す
            if ($i > now()->month) {
                $months->push([
                    'month' => $start->format('Y-m'),
                    'total' => 0,
                ]);
                continue;
            }

            // 「注文数×単価」で売上金額を計算
            $orders = \App\Models\Order::where('shipping', 1)
                ->whereBetween('orderday', [$start, $end])
                ->with('pen')
                ->get();

            $total = $orders->sum(function ($order) {
                return $order->pen
                    ? $order->num * $order->pen->price
                    : 0;
            });

            $months->push([
                'month' => $start->format('Y-m'),
                'total' => $total,
            ]);
        }
        return response()->json($months->values());
    }

    public function weekly()
    {
        $weeks = collect();
        $now = now();
        $startOfMonth = $now->copy()->startOfMonth();
        $endOfMonth = $now->copy()->endOfMonth();

        // 月初から週を計算（月初から開始）
        $currentWeekStart = $startOfMonth->copy();
        $weekCounter = 1;

        // 月内の週を計算
        while ($currentWeekStart->lte($endOfMonth)) {
            // 週の終了は7日後か月末のどちらか早い方
            $weekEnd = $currentWeekStart->copy()->addDays(6);
            if ($weekEnd->gt($endOfMonth)) {
                $weekEnd = $endOfMonth->copy();
            }

            // 「注文数×単価」で売上金額を計算
            $orders = \App\Models\Order::where('shipping', 1)
                ->whereBetween('orderday', [$currentWeekStart, $weekEnd])
                ->with('pen')
                ->get();

            $total = $orders->sum(function ($order) {
                return $order->pen
                    ? $order->num * $order->pen->price
                    : 0;
            });

            $weeks->push([
                'week' => 'W' . $weekCounter,
                'total' => $total,
            ]);

            // 次の週の開始日に進める（7日後）
            $currentWeekStart = $weekEnd->copy()->addDay();
            $weekCounter++;
        }

        return response()->json($weeks->values());
    }
}
