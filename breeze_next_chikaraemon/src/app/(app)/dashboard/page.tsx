'use client';

import { useAuth } from '@/hooks/auth';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import {
  fetchOutOfStockProducts,
  fetchLowStockProducts,
  fetchProductTotal,
  fetchWeeklyTopProducts,
  fetchOrderStatusSummary,
  fetchMonthlySales,
  fetchWeeklySales,
} from '@/lib/dashboard';
import { InventoryList } from '@/components/dashboard/InventoryList';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { WeeklyTopProductsList } from '@/components/dashboard/WeeklyTopProductsList';
import { OrderStatusCards } from '@/components/dashboard/OrderStatusCards';
import dynamic from 'next/dynamic';

const SalesBarChart = dynamic(
  () =>
    import('@/components/dashboard/SalesBarChart').then(
      mod => mod.SalesBarChart,
    ),
  { ssr: false },
);

const DashboardPage = () => {
  const [mounted, setMounted] = useState(false);
  const { user, isValidating: authValidating } = useAuth({
    middleware: 'auth',
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // SWR データフェッチ
  const { data: outOfStock = [] } = useSWR(
    '/api/products/out-of-stock',
    fetchOutOfStockProducts,
  );
  const { data: lowStock = [] } = useSWR(
    '/api/products/low-stock',
    fetchLowStockProducts,
  );
  const { data: productTotal = 0 } = useSWR(
    '/api/products/total',
    fetchProductTotal,
  );
  const { data: topProducts = [] } = useSWR(
    '/api/sales/top-weekly',
    fetchWeeklyTopProducts,
  );
  const { data: orderSummary = { unshipped: 0, shipped: 0 } } = useSWR(
    '/api/orders/status-summary',
    fetchOrderStatusSummary,
  );
  const { data: monthlySales } = useSWR(
    '/api/sales/monthly',
    fetchMonthlySales,
  );
  const { data: weeklySales } = useSWR('/api/sales/weekly', fetchWeeklySales);

  if (!mounted || authValidating) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4" />
        <div className="text-gray-600">ロード中...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <div className="text-center p-4">
          ユーザー情報が見つかりません。再ログインしてください。
        </div>
        <button
          onClick={() => {
            window.location.href = '/login';
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          ログイン画面へ
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h2 className="text-2xl font-semibold">
        ようこそ {user.data.name} さん！
      </h2>

      {/* 上部サマリ */}
      <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
        <StatsCard title="商品総数" value={productTotal} />
        <OrderStatusCards summary={orderSummary} />
      </div>

      {/* 在庫系 + トップ商品 */}
      <div className="grid gap-6 lg:grid-cols-3">
        <InventoryList title="在庫切れ商品" products={outOfStock} />
        <InventoryList title="在庫5個以下" products={lowStock} />
        <WeeklyTopProductsList products={topProducts} />
      </div>

      {/* 売上グラフ */}
      <div className="grid gap-6 lg:grid-cols-2">
        {weeklySales && (
          <SalesBarChart
            labels={weeklySales.labels}
            data={weeklySales.values}
            title="週別売上"
          />
        )}
        {monthlySales && (
          <SalesBarChart
            labels={monthlySales.labels}
            data={monthlySales.values}
            title="月別売上"
          />
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
