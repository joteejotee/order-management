'use client';

import useSWR from 'swr';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
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
import { fetchUser } from './authFunctions';
import {
  loadLoginFunction,
  loadLogoutFunction,
  loadRegisterFunction,
  loadResetPasswordFunction,
  loadForgotPasswordFunction,
  loadResendEmailVerificationFunction,
} from './dynamicAuth';
import type { AxiosError } from 'axios';

/**
 * 最適化された認証フック
 * 必要な認証機能だけを動的にロードして使用します
 */
export function useOptimizedAuth({
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
  const swrKey = shouldFetch ? '/api/user' : null;

  // ユーザーデータをローカルストレージから取得
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
  const clearCache = useCallback(() => {
    localStorage.removeItem('user');
  }, []);

  // SWRの設定
  const { data, error, mutate, isValidating } = useSWR(swrKey, fetchUser, {
    dedupingInterval: 5000,
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    shouldRetryOnError: true,
    errorRetryCount: 3,
    errorRetryInterval: 2000,
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

  // データ再取得メソッド
  const forceRefresh = useCallback(async (): Promise<void> => {
    await mutate();
  }, [mutate]);

  // ログイン処理 - 動的インポート
  const login = useCallback(
    async ({ email, password }: LoginCredentials) => {
      setIsLoading(true);
      try {
        const performLogin = await loadLoginFunction();
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
    },
    [router, mutate],
  );

  // ログアウト処理 - 動的インポート
  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      const performLogout = await loadLogoutFunction();
      await performLogout(clearCache, mutate);
      setIsRouting(true);
    } catch (error) {
      // エラー処理
    } finally {
      setIsLoading(false);
    }
  }, [clearCache, mutate]);

  // 登録処理 - 動的インポート
  const register = useCallback(
    async (credentials: RegisterCredentials) => {
      const performRegister = await loadRegisterFunction();
      await performRegister(credentials, mutate);
    },
    [mutate],
  );

  // パスワードリセット処理 - 動的インポート
  const resetPassword = useCallback(
    async (credentials: ResetPasswordCredentials) => {
      const performResetPassword = await loadResetPasswordFunction();
      await performResetPassword(credentials);
    },
    [],
  );

  // パスワード忘れ処理 - 動的インポート
  const forgotPassword = useCallback(
    async (request: ForgotPasswordRequest): Promise<void> => {
      const performForgotPassword = await loadForgotPasswordFunction();
      await performForgotPassword(request);
    },
    [],
  );

  // メール確認再送信処理 - 動的インポート
  const resendEmailVerification = useCallback(
    async (request: EmailVerificationRequest): Promise<void> => {
      const performResendEmailVerification =
        await loadResendEmailVerificationFunction();
      await performResendEmailVerification(request);
    },
    [],
  );

  // ミドルウェアの効果を処理
  useEffect(() => {
    if (!isValidating) {
      const stabilityTimer = setTimeout(() => {
        // ホームページのリダイレクト処理
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
      }, 500);

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

  // ルーティング状態をリセット
  useEffect(() => {
    if (isRouting) {
      const timer = setTimeout(() => {
        setIsRouting(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isRouting]);

  // 実際のユーザーデータ
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
