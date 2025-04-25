import axios from '@/lib/axios';
import type { AxiosError, AxiosResponse } from 'axios';
import {
  LoginCredentials,
  RegisterCredentials,
  ResetPasswordCredentials,
  ForgotPasswordRequest,
  EmailVerificationRequest,
  ErrorResponse,
} from './authTypes';

// ユーザー情報を取得する関数
export async function fetchUser(url: string): Promise<any> {
  try {
    const response = await axios.get(url, {
      withCredentials: true,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    // 成功した場合はユーザー情報をローカルストレージに保存
    if (response.data && response.data.data) {
      localStorage.setItem('user', JSON.stringify(response.data.data));
    }

    return response;
  } catch (error) {
    // Axiosエラーの場合
    const axiosError = error as AxiosError<ErrorResponse>;

    // 401エラー（認証が必要）の場合
    if (axiosError.response?.status === 401) {
      // ローカルストレージからユーザー情報を削除
      localStorage.removeItem('user');
    }

    // エラーを再スロー
    throw error;
  }
}

// ログイン処理
export async function performLogin(
  { email, password }: LoginCredentials,
  mutate: any,
  router: any,
): Promise<void> {
  // CSRFトークンの取得
  await axios.get('/sanctum/csrf-cookie');

  // ログイン処理
  await axios.post('/api/login', {
    email,
    password,
    remember: false,
  });

  // SWRキャッシュを更新（バックグラウンドでの再取得なし）
  await mutate(undefined, { revalidate: false });

  // ダッシュボードへリダイレクト
  router.push('/dashboard');
}

// ログアウト処理
export async function performLogout(
  clearCache: () => void,
  mutate: any,
): Promise<void> {
  await axios.post('/api/logout');
  // ローカルストレージからユーザー情報を削除
  clearCache();
  await mutate(null, { revalidate: false });
  window.location.href = '/login'; // フルページリロードを強制
}

// ユーザー登録処理
export async function performRegister(
  {
    name,
    email,
    password,
    password_confirmation,
    setErrors,
  }: RegisterCredentials,
  mutate: any,
): Promise<void> {
  setErrors({});

  try {
    await axios.post('/api/register', {
      name,
      email,
      password,
      password_confirmation,
    });

    await mutate();
    window.location.href = '/dashboard'; // フルページリロードを強制
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    if (axiosError.response?.data?.errors) {
      setErrors(axiosError.response.data.errors);
    }
  }
}

// パスワードリセット処理
export async function performResetPassword({
  email,
  password,
  password_confirmation,
  token,
  setErrors,
  setStatus,
}: ResetPasswordCredentials): Promise<void> {
  setErrors({});
  setStatus(null);

  try {
    const response = (await axios.post('/api/reset-password', {
      email,
      password,
      password_confirmation,
      token,
    })) as AxiosResponse<{ status: string }>;

    window.location.href = '/login?reset=' + btoa(response.data.status); // フルページリロードを強制
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    if (axiosError.response?.data?.errors) {
      setErrors(axiosError.response.data.errors);
    }
  }
}

// パスワード忘れ処理
export async function performForgotPassword({
  email,
  setErrors,
  setStatus,
}: ForgotPasswordRequest): Promise<void> {
  setErrors({});

  try {
    const response = await axios.post('/api/forgot-password', { email });
    if (setStatus) {
      setStatus(response.data.status);
    }
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    if (axiosError.response?.data?.errors) {
      setErrors(axiosError.response.data.errors);
    }
  }
}

// メール確認再送信処理
export async function performResendEmailVerification({
  setStatus,
}: EmailVerificationRequest): Promise<void> {
  try {
    const response = await axios.post('/api/email/verification-notification');
    if (setStatus) {
      setStatus(response.data.status);
    }
  } catch (error) {
    // エラー処理
  }
}
