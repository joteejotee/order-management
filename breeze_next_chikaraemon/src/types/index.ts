/**
 * 型定義のエントリーポイント
 * @module types
 */

export * from './user';

/**
 * APIレスポンスの基本型
 * @interface ApiResponse
 */
export type ApiResponse<T> = {
  data: T;
};

/**
 * 注文関連の型
 * @interface Order
 */
export type Order = {
  id: number;
  customer_id: number;
  pen_id: number;
  quantity: number;
  total_price: number;
  status: string;
  created_at: string;
  updated_at: string;
};

/**
 * ペン関連の型
 * @interface Pen
 */
export type Pen = {
  id: number;
  name: string;
  price: number;
  description: string;
  stock: number;
  created_at: string;
  updated_at: string;
};

/**
 * 顧客関連の型
 * @interface Customer
 */
export type Customer = {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  created_at: string;
  updated_at: string;
};

/**
 * 注文作成レスポンスの型
 * @interface OrderCreateResponse
 */
export type OrderCreateResponse = {
  order: Order;
  message: string;
  pens: Pen[];
  customers: Customer[];
};

/**
 * パスワードリセット要求の型
 * @interface ForgotPasswordRequest
 */
export type ForgotPasswordRequest = {
  email: string;
  setErrors: (errors: { email?: string[] }) => void;
  setStatus: (status: string | null) => void;
};

/**
 * メール認証再送要求の型
 * @interface EmailVerificationRequest
 */
export type EmailVerificationRequest = {
  setStatus: (status: string | null) => void;
};
