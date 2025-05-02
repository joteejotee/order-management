'use client';

import useSWR from 'swr';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ApiResponse } from '@/types';
import type { UserData } from '@/types';
import {
  AuthConfig,
  AuthHook,
  LoginCredentials,
  RegisterCredentials,
  ResetPasswordCredentials,
  ForgotPasswordRequest,
  EmailVerificationRequest,
} from './authTypes';
import {
  fetchUser,
  performLogin,
  performLogout,
  performRegister,
  performResetPassword,
  performForgotPassword,
  performResendEmailVerification,
} from './authFunctions';
import type { AxiosError } from 'axios';

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
      }
    } catch (error) {
      // エラー処理
    }
  }, []);

  // キャッシュをクリアする関数
  const clearCache = () => {
    localStorage.removeItem('user');
  };

  // SWRの設定を改善
  const { data, error, mutate, isValidating } = useSWR(swrKey, fetchUser, {
    dedupingInterval: 5000, // 5秒間は重複リクエストを防止
    revalidateIfStale: false, // 古いデータの自動再検証を無効化
    revalidateOnFocus: false, // フォーカス時の再検証を無効化
    revalidateOnReconnect: true, // 再接続時の再検証を有効化
    shouldRetryOnError: true, // エラー時の自動再試行を有効化
    errorRetryCount: 3, // エラー時の再試行回数を3回に設定
    errorRetryInterval: 2000, // エラー時の再試行間隔を2秒に設定
    loadingTimeout: 5000, // ローディングタイムアウトを5秒に設定
    focusThrottleInterval: 5000, // フォーカス時の再検証を5秒間隔に制限
    onLoadingSlow: () => {
      // ローディングが遅い場合の処理
    },
    onSuccess: data => {
      if (data?.data) {
        localStorage.setItem('user', JSON.stringify(data.data));
      }
    },
    onError: (err: Error) => {
      if (err.message.includes('401')) {
        localStorage.removeItem('user');
      }
    },
  });

  // 強制的にデータを再取得するメソッド
  const forceRefresh = async (): Promise<void> => {
    await mutate();
  };

  // ログイン処理をラップ
  const login = async ({ email, password }: LoginCredentials) => {
    setIsLoading(true);
    try {
      await performLogin({ email, password }, mutate, router);
    } catch (error: unknown) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        (error as AxiosError).response?.status === 422
      ) {
        throw new Error('メールアドレスまたはパスワードが正しくありません。');
      }
      throw new Error('ログイン処理に失敗しました。もう一度お試しください。');
    } finally {
      setIsLoading(false);
    }
  };

  // ログアウト処理をラップ
  const logout = async () => {
    setIsLoading(true);
    try {
      await performLogout(clearCache, mutate);
      setIsRouting(true);
    } catch (error) {
      // エラー処理
    } finally {
      setIsLoading(false);
    }
  };

  // 登録処理をラップ
  const register = async (credentials: RegisterCredentials) => {
    await performRegister(credentials, mutate);
  };

  // パスワードリセット処理をラップ
  const resetPassword = async (credentials: ResetPasswordCredentials) => {
    await performResetPassword(credentials);
  };

  // パスワード忘れ処理をラップ
  const forgotPassword = async (
    request: ForgotPasswordRequest,
  ): Promise<void> => {
    await performForgotPassword(request);
  };

  // メール確認再送信処理をラップ
  const resendEmailVerification = async (
    request: EmailVerificationRequest,
  ): Promise<void> => {
    await performResendEmailVerification(request);
  };

  // ミドルウェアの効果を処理
  useEffect(() => {
    if (!isValidating) {
      // 認証状態が安定するまで待機
      const stabilityTimer = setTimeout(() => {
        // ホームページのリダイレクト処理（特別なケース）
        if (window.location.pathname === '/' && !isRouting) {
          if (data?.data || localUser) {
            setIsRouting(true);
            window.location.href = '/dashboard';
          } else if (error || (!data && !localUser && !isValidating)) {
            setIsRouting(true);
            window.location.href = '/login';
          }
        }

        // 未認証ユーザーのリダイレクト
        if (middleware === 'auth' && error && !localUser && !isRouting) {
          setIsRouting(true);
          window.location.href = '/login';
        }

        // 認証済みユーザーのリダイレクト
        if (
          redirectIfAuthenticated &&
          (data?.data || localUser) &&
          !isRouting
        ) {
          setIsRouting(true);
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
    user: actualUser ?? undefined,
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
