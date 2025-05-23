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
import dynamic from 'next/dynamic';
import { LoadingOverlay } from '@/components/ui/loading-overlay';

// アイコンのインポート
import { Box, AlertTriangle, CheckCircle } from 'lucide-react';

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
    return <LoadingOverlay message="ダッシュボードを読み込み中..." />;
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
    <div className="container mx-auto p-4 space-y-6">
      <div className="grid grid-cols-12 gap-6">
        {/* 左側セクション - 9列幅 */}
        <div className="col-span-12 lg:col-span-9 grid gap-6">
          {/* 上部セクション - 商品総数、注文ステータス */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* 商品総数 */}
            <div className="col-span-1">
              <StatsCard
                title="商品総数"
                value={productTotal.toLocaleString()}
                icon={<Box size={45} />}
                color="blue"
              />
            </div>

            {/* 注文ステータス */}
            <div className="col-span-1">
              <StatsCard
                title="未出荷"
                value={orderSummary.unshipped.toLocaleString()}
                icon={<AlertTriangle size={45} />}
                color="red"
              />
            </div>
            <div className="col-span-1">
              <StatsCard
                title="出荷済"
                value={orderSummary.shipped.toLocaleString()}
                icon={<CheckCircle size={45} />}
                color="green"
              />
            </div>
          </div>

          {/* 中段セクション - 売れ筋商品と週別売上 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* 週別売上グラフ */}
            <div className="col-span-1">
              {weeklySales && (
                <SalesBarChart
                  labels={weeklySales.labels}
                  data={weeklySales.values}
                  title="週別売上"
                  color="green"
                  stepSize={1000}
                />
              )}
            </div>

            {/* 売れ筋商品ランキング */}
            <div className="col-span-1">
              <WeeklyTopProductsList products={topProducts} />
            </div>
          </div>

          {/* 下段セクション - 月別売上グラフ */}
          <div>
            {monthlySales && (
              <SalesBarChart
                labels={monthlySales.labels}
                data={monthlySales.values}
                title="月別売上"
                color="purple"
              />
            )}
          </div>
        </div>

        {/* 右側セクション - 3列幅 */}
        <div className="col-span-12 lg:col-span-3 grid grid-rows-2 gap-6 h-full">
          {/* 在庫切れ商品 */}
          <div className="row-span-1 h-full">
            <InventoryList
              title="在庫切れ商品"
              products={outOfStock}
              color="red"
            />
          </div>

          {/* 在庫5個以下 */}
          <div className="row-span-1 h-full">
            <InventoryList
              title="在庫5個以下"
              products={lowStock}
              color="amber"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
