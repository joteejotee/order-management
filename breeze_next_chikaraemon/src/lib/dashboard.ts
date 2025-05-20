import axios from '@/lib/axios';
import type {
  Product,
  OrderStatusSummary,
  SalesByPeriod,
} from '@/types/dashboard';

/*
 * 在庫切れ商品（在庫0）の取得
 */
export async function fetchOutOfStockProducts(): Promise<Product[]> {
  const { data } = await axios.get<Product[]>('/api/products/out-of-stock');
  return data;
}

/*
 * 在庫5個以下の商品取得
 */
export async function fetchLowStockProducts(): Promise<Product[]> {
  const { data } = await axios.get<Product[]>('/api/products/low-stock');
  return data;
}

/*
 * 商品総数の取得
 */
export async function fetchProductTotal(): Promise<number> {
  const { data } = await axios.get<{ total: number }>('/api/products/total');
  return data.total;
}

/*
 * 今週の売上トップ5商品
 */
export async function fetchWeeklyTopProducts(): Promise<Product[]> {
  const { data } = await axios.get<Product[]>('/api/sales/top-weekly');
  return data;
}

/*
 * 注文ステータスサマリ
 */
export async function fetchOrderStatusSummary(): Promise<OrderStatusSummary> {
  const { data } = await axios.get<OrderStatusSummary>(
    '/api/orders/status-summary',
  );
  return data;
}

/*
 * 月別売上推移
 */
export async function fetchMonthlySales(): Promise<SalesByPeriod> {
  const { data } = await axios.get('/api/sales/monthly');
  // APIレスポンスを変換: [{ month: "...", total: ... }] → { labels: [...], values: [...] }
  const labels = data.map(
    (item: { month: string; total: string }) => item.month,
  );
  const values = data.map((item: { month: string; total: string }) =>
    parseInt(item.total, 10),
  );

  return { labels, values };
}

/*
 * 週別売上推移
 */
export async function fetchWeeklySales(): Promise<SalesByPeriod> {
  const { data } = await axios.get('/api/sales/weekly');
  // APIレスポンスを変換: [{ week: "...", total: ... }] → { labels: [...], values: [...] }
  const labels = data.map((item: { week: string; total: string }) => item.week);
  const values = data.map((item: { week: string; total: string }) =>
    parseInt(item.total, 10),
  );

  return { labels, values };
}
