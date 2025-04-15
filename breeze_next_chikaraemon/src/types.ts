export interface ApiResponse<T> {
  data: T;
}

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Pen {
  id: number;
  name: string;
  price: number;
  stock: number;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

// DBモデルに対応する型（バックエンドの構造）
export interface OrderModel {
  id: number;
  pen_id: number;
  customer_id: number;
  num: number;          // DBのカラム名をそのまま使用
  shipping: 0 | 1;      // 実際のDBの値
  orderday: string;
  created_at: string;
  updated_at: string;
  pen: Pen;
  customer: Customer;
}

// フロントエンド表示用の型
export interface Order {
  id: number;
  pen_id: number;
  customer_id: number;
  quantity: number;     // numの表示用エイリアス
  status: 'pending' | 'shipped';  // shippingの表示用変換
  orderday: string;
  created_at: string;
  updated_at: string;
  pen: Pen;
  customer: Customer;
}

// 変換用のユーティリティ関数
export const convertToOrderView = (model: OrderModel): Order => ({
  ...model,
  quantity: model.num,
  status: model.shipping === 1 ? 'shipped' : 'pending'
});

// 逆変換用のユーティリティ関数
export const convertToOrderModel = (view: Partial<Order>): Partial<OrderModel> => {
  const model: Partial<OrderModel> = { ...view };
  
  if ('quantity' in view) {
    model.num = view.quantity;
    delete (model as any).quantity;
  }
  
  if ('status' in view) {
    model.shipping = view.status === 'shipped' ? 1 : 0;
    delete (model as any).status;
  }
  
  return model;
};

export interface Pagination {
  current_page: number;
  total: number;
}

export interface PaginationMeta {
  current_page: number;
  from: number;
  last_page: number;
  path: string;
  per_page: number;
  to: number;
  total: number;
  next_page_url: string | null;
  prev_page_url: string | null;
}

export interface RegisterProps {
  setErrors: (errors: any) => void;
  setStatus: (status: string | null) => void;
  name?: string;
  email?: string;
}
