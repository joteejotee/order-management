'use client';

import useSWR, { SWRResponse } from 'swr';
import axios from '@/lib/axios';
import { AxiosError, AxiosResponse } from 'axios';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import type { ApiResponse, User, UserData } from '@/types';

// エラーレスポンスの型定義
interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  setErrors: (errors: Record<string, string[]>) => void;
}

interface ResetPasswordCredentials {
  email: string;
  password: string;
  password_confirmation: string;
  token: string;
  setErrors: (errors: Record<string, string[]>) => void;
  setStatus: (status: string | null) => void;
}

interface ForgotPasswordRequest {
  email: string;
  setErrors: (errors: Record<string, string[]>) => void;
  setStatus?: (status: string | null) => void;
}

interface EmailVerificationRequest {
  setStatus?: (status: string | null) => void;
}

interface AuthHook {
  user: ApiResponse<UserData> | undefined;
  isValidating: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  resetPassword: (credentials: ResetPasswordCredentials) => Promise<void>;
  forceRefresh: () => Promise<void>;
  clearCache: () => void;
  forgotPassword: (request: ForgotPasswordRequest) => Promise<void>;
  resendEmailVerification: (request: EmailVerificationRequest) => Promise<void>;
}

interface AuthConfig {
  middleware?: string;
  redirectIfAuthenticated?: string;
}

export function useAuth({
  middleware,
  redirectIfAuthenticated,
}: AuthConfig = {}): AuthHook {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isRouting, setIsRouting] = useState(false);
  const [localUser, setLocalUser] = useState<ApiResponse<UserData> | null>(
    null,
  );

  // ミドルウェアがguestの場合は自動フェッチを無効化
  const shouldFetch = middleware !== 'guest';
  // URLを/api/userに固定
  const swrKey = shouldFetch ? '/api/user' : null;

  // ユーザーデータをローカルストレージから取得する試み
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setLocalUser(parsedUser);
        console.log('Auth - Loaded user from localStorage:', parsedUser);
      }
    } catch (error) {
      console.error('Auth - Error loading user from localStorage:', error);
    }
  }, []);

  // キャッシュをクリアする関数
  const clearCache = () => {
    localStorage.removeItem('user');
  };

  // ユーザー情報を取得する関数
  const fetchUser = async (url: string): Promise<any> => {
    try {
      console.log('Auth - Fetching user data from:', url);
      const response = await axios.get(url, {
        withCredentials: true,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      console.log('Auth - User data fetch success:', response.data);

      // 成功した場合はユーザー情報をローカルストレージに保存
      if (response.data && response.data.data) {
        localStorage.setItem('user', JSON.stringify(response.data.data));
      }

      return response;
    } catch (error) {
      console.error('Auth - Error fetching user:', error);

      // Axiosエラーの場合
      const axiosError = error as AxiosError<ErrorResponse>;

      // 401エラー（認証が必要）の場合
      if (axiosError.response?.status === 401) {
        console.log('Auth - 401 Unauthorized response');
        // ローカルストレージからユーザー情報を削除
        localStorage.removeItem('user');
      }

      // エラーを再スロー
      throw error;
    }
  };

  // SWRの設定を改善
  const { data, error, mutate, isValidating } = useSWR(swrKey, fetchUser, {
    dedupingInterval: 2000, // 2秒間は重複リクエストを防止
    revalidateIfStale: true, // 古いデータの自動再検証を有効化
    revalidateOnFocus: true, // フォーカス時の再検証を有効化
    revalidateOnReconnect: true, // 再接続時の再検証を有効化
    shouldRetryOnError: true, // エラー時の自動再試行を有効化
    errorRetryCount: 3, // エラー時の再試行回数を3回に設定
    errorRetryInterval: 2000, // エラー時の再試行間隔を2秒に設定
    loadingTimeout: 5000, // ローディングタイムアウトを5秒に設定
    focusThrottleInterval: 5000, // フォーカス時の再検証を5秒間隔に制限
    onLoadingSlow: () =>
      console.log('Auth - Loading is taking longer than expected'),
    onSuccess: data => {
      console.log('Auth - Successfully fetched user data:', data);
      if (data?.data) {
        localStorage.setItem('user', JSON.stringify(data.data));
      }
    },
    onError: (err: Error) => {
      console.error('Auth - SWR Error:', err);
      if (err.message.includes('401')) {
        localStorage.removeItem('user');
      }
    },
  });

  // 強制的にデータを再取得するメソッド
  const forceRefresh = async (): Promise<void> => {
    console.log('Auth - Force refreshing user data');
    await mutate();
  };

  const login = async ({ email, password }: LoginCredentials) => {
    setIsLoading(true);
    try {
      console.log('Auth - ログイン処理を開始します');

      // バックエンドURLを確認
      console.log('Auth - 現在のAPI URLを確認:', axios.defaults.baseURL);

      // CSRFトークンの取得を試行
      console.log('Auth - CSRFトークンを取得中...');
      try {
        const csrfResponse = await axios.get('/sanctum/csrf-cookie', {
          withCredentials: true,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        });
        console.log('Auth - CSRFトークン取得成功:', csrfResponse);
      } catch (csrfError: any) {
        console.error('Auth - CSRFトークン取得失敗:', csrfError.message);
        if (csrfError.response) {
          console.error('- ステータス:', csrfError.response.status);
          console.error('- データ:', csrfError.response.data);
          console.error('- ヘッダー:', csrfError.response.headers);
        } else if (csrfError.request) {
          console.error('- リクエスト:', csrfError.request);
        }
        throw new Error(
          'CSRFトークンの取得に失敗しました。ネットワーク接続を確認してください。',
        );
      }

      // 現在のCookieを確認
      console.log('Auth - 現在のCookie:', document.cookie);

      // ログイン処理
      console.log('Auth - ログインリクエストを送信中...');
      try {
        const loginData = {
          email,
          password,
          remember: false,
        };
        console.log(
          'Auth - ログインリクエストデータ:',
          JSON.stringify(loginData),
        );

        const loginResponse = await axios.post('/api/login', loginData, {
          withCredentials: true,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        });
        console.log('Auth - ログイン成功:', loginResponse);
      } catch (loginError: any) {
        console.error('Auth - ログイン処理失敗:', loginError.message);
        if (loginError.response) {
          console.error('- ステータス:', loginError.response.status);
          console.error('- データ:', loginError.response.data);
          console.error('- ヘッダー:', loginError.response.headers);
        } else if (loginError.request) {
          console.error('- リクエスト:', loginError.request);
        }

        if (loginError.response && loginError.response.status === 422) {
          throw new Error('メールアドレスまたはパスワードが正しくありません。');
        }

        throw new Error('ログイン処理に失敗しました。もう一度お試しください。');
      }

      // ログイン後の処理
      console.log('Auth - ログイン後のユーザー情報を取得中...');

      try {
        // ユーザー情報を取得
        const userResponse = await axios.get('/api/user', {
          withCredentials: true,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        });
        console.log('Auth - ユーザー情報取得成功:', userResponse.data);

        // SWRキャッシュを更新
        await mutate();
        console.log('Auth - ユーザー情報の更新完了');
      } catch (userError: any) {
        console.error('Auth - ユーザー情報取得エラー:', userError);
        if (userError.response) {
          console.error('- ステータス:', userError.response.status);
          console.error('- データ:', userError.response.data);
        }
        // ユーザー情報取得エラーは致命的ではないため、処理を続行
      }

      // Cookieを再確認
      console.log('Auth - 最終Cookie状態:', document.cookie);

      setIsRouting(true);
      console.log('Auth - ダッシュボードへリダイレクト');
      window.location.href = '/dashboard'; // フルページリロードを強制
    } catch (error) {
      console.error('ログインエラー:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await axios.post('/api/logout');
      // ローカルストレージからユーザー情報を削除
      clearCache();
      await mutate(null, { revalidate: false });
      setIsRouting(true);
      window.location.href = '/login'; // フルページリロードを強制
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async ({
    name,
    email,
    password,
    password_confirmation,
    setErrors,
  }: RegisterCredentials) => {
    setErrors({});

    axios
      .post('/api/register', {
        name,
        email,
        password,
        password_confirmation,
      })
      .then(() => {
        mutate();
        window.location.href = '/dashboard'; // フルページリロードを強制
      })
      .catch((error: AxiosError<ErrorResponse>) => {
        if (error.response?.data?.errors) {
          setErrors(error.response.data.errors);
        }
      });
  };

  const resetPassword = async ({
    email,
    password,
    password_confirmation,
    token,
    setErrors,
    setStatus,
  }: ResetPasswordCredentials) => {
    setErrors({});
    setStatus(null);

    axios
      .post('/api/reset-password', {
        email,
        password,
        password_confirmation,
        token,
      })
      .then((response: AxiosResponse<{ status: string }>) => {
        window.location.href = '/login?reset=' + btoa(response.data.status); // フルページリロードを強制
      })
      .catch((error: AxiosError<ErrorResponse>) => {
        if (error.response?.data?.errors) {
          setErrors(error.response.data.errors);
        }
      });
  };

  const forgotPassword = async ({
    email,
    setErrors,
    setStatus,
  }: ForgotPasswordRequest): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await axios.post('/forgot-password', { email });
      console.log('Auth - パスワードリセットメール送信成功:', response.data);
      setStatus?.('パスワードリセットメールを送信しました。');
    } catch (error) {
      console.error('Auth - パスワードリセットメール送信失敗:', error);
      if (error instanceof AxiosError && error.response?.data?.errors) {
        setErrors?.(error.response.data.errors);
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resendEmailVerification = async ({
    setStatus,
  }: EmailVerificationRequest): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await axios.post('/email/verification-notification');
      console.log('Auth - メール認証再送信成功:', response.data);
      setStatus?.('認証メールを再送信しました。');
    } catch (error) {
      console.error('Auth - メール認証再送信失敗:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // ミドルウェアの効果を処理
  useEffect(() => {
    if (!isValidating) {
      const authState = {
        path: window.location.pathname,
        user: data?.data || localUser,
        error,
        middleware,
        redirectIfAuthenticated,
        isRouting,
      };
      console.log('Auth - Middleware Effect:', authState);

      // 認証状態が安定するまで待機
      const stabilityTimer = setTimeout(() => {
        // ホームページのリダイレクト処理（特別なケース）
        if (window.location.pathname === '/' && !isRouting) {
          if (data?.data || localUser) {
            setIsRouting(true);
            console.log(
              'Auth - Home page with user -> redirecting to dashboard',
            );
            window.location.href = '/dashboard';
          } else if (error || (!data && !localUser && !isValidating)) {
            setIsRouting(true);
            console.log(
              'Auth - Home page without user -> redirecting to login',
            );
            window.location.href = '/login';
          }
        }

        // 未認証ユーザーのリダイレクト
        if (middleware === 'auth' && error && !localUser && !isRouting) {
          setIsRouting(true);
          console.log(
            'Auth - Auth middleware, no user -> redirecting to login',
          );
          window.location.href = '/login';
        }

        // 認証済みユーザーのリダイレクト
        if (
          redirectIfAuthenticated &&
          (data?.data || localUser) &&
          !isRouting
        ) {
          setIsRouting(true);
          console.log(
            `Auth - Authenticated user -> redirecting to ${redirectIfAuthenticated}`,
          );
          window.location.href = redirectIfAuthenticated;
        }
      }, 500); // 500ミリ秒の安定化待機時間

      return () => clearTimeout(stabilityTimer);
    }
  }, [
    data,
    localUser,
    error,
    middleware,
    redirectIfAuthenticated,
    isValidating,
    isRouting,
  ]);

  // ルーティング状態をリセットするエフェクト
  useEffect(() => {
    if (isRouting) {
      const timer = setTimeout(() => {
        setIsRouting(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isRouting]);

  // 実際のユーザーデータ（APIレスポンスまたはローカルストレージから）
  const actualUser = data?.data || localUser;

  return {
    user: actualUser,
    login,
    logout,
    register,
    resetPassword,
    isLoading,
    isValidating,
    forceRefresh,
    clearCache,
    forgotPassword,
    resendEmailVerification,
  };
}
