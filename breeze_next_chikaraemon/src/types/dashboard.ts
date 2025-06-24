export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  salesAmount?: number;
  salesCount?: number;
}

export interface OrderStatusSummary {
  unshipped: number;
  shipped: number;
}

export interface SalesByPeriod {
  labels: string[];
  values: number[];
}
