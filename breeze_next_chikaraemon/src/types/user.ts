/**
 * ユーザーデータの基本型
 * @interface UserData
 */
interface UserData {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * APIレスポンスのユーザー型
 * @interface User
 */
interface User {
  data: UserData;
}
// 型のエクスポート
export type { UserData, User };
