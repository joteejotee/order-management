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
  // 他の必要なプロパティ
}

export interface Order {
  id: number;
  pen_id: number;
  customer_id: number;
  quantity: number;
  status: 'pending' | 'shipped';
  created_at: string;
  updated_at: string;
  orderday: string;
  pen: Pen;
  customer: Customer;
}

export interface Pagination {
  current_page: number;
  total: number;
  // 他の必要なプロパティ
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
