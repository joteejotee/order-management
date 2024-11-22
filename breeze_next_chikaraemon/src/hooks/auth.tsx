import useSWR from 'swr';
import axios from 'axios';
import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction } from 'react';
import { User } from '@/types/user';

const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

// axiosの設定を更新
axios.defaults.baseURL = apiUrl;
axios.defaults.withCredentials = true;

// オプションの型定義
interface UseAuthOptions {
  middleware?: 'guest' | 'auth';
  redirectIfAuthenticated?: string;
}

export const useAuth = ({
  middleware,
  redirectIfAuthenticated,
}: UseAuthOptions = {}) => {
  const router = useRouter();

  // 修正: useSWR の型定義を追加
  const { data: user, error, mutate } = useSWR<User>('/api/user', () =>
    axios
      .get('/api/user')
      .then(res => res.data)
      .catch(error => {
        if (error.response.status !== 409) throw error;

        router.push('/verify-email');
      }),
  );

  const csrf = () => axios.get('/sanctum/csrf-cookie');

  const register = async ({
    name,
    email,
    password,
    password_confirmation,
    setErrors,
  }: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    setErrors: Dispatch<
      SetStateAction<{
        name?: string[];
        email?: string[];
        password?: string[];
        password_confirmation?: string[];
      }>
    >;
  }) => {
    await csrf();

    setErrors({});

    axios
      .post('/register', { name, email, password, password_confirmation })
      .then(() => mutate())
      .catch(error => {
        if (error.response.status !== 422) throw error;

        setErrors(error.response.data.errors);
      });
  };

  const login = async ({
    email,
    password,
    remember,
    setErrors,
    setStatus,
  }: {
    email: string;
    password: string;
    remember: boolean;
    setErrors: Dispatch<
      SetStateAction<{ email?: string[]; password?: string[] }>
    >;
    setStatus: Dispatch<SetStateAction<string | null>>;
  }) => {
    await csrf();

    setErrors({});
    setStatus(null);

    axios
      .post('/login', { email, password, remember })
      .then(() => mutate())
      .catch(error => {
        if (error.response.status !== 422) throw error;

        setErrors(error.response.data.errors);
      });
  };

  const forgotPassword = async ({
    email,
    setErrors,
    setStatus,
  }: {
    email: string;
    setErrors: Dispatch<SetStateAction<{ email?: string[] }>>;
    setStatus: Dispatch<SetStateAction<string | null>>;
  }) => {
    await csrf();

    setErrors({});
    setStatus(null);

    axios
      .post('/forgot-password', { email })
      .then(response => setStatus(response.data.status))
      .catch(error => {
        if (error.response.status !== 422) throw error;

        setErrors(error.response.data.errors);
      });
  };

  const resetPassword = async ({
    email,
    password,
    password_confirmation,
    token,
    setErrors,
    setStatus,
  }: {
    email: string;
    password: string;
    password_confirmation: string;
    token: string;
    setErrors: Dispatch<
      SetStateAction<{
        email?: string[];
        password?: string[];
        password_confirmation?: string[];
      }>
    >;
    setStatus: Dispatch<SetStateAction<string | null>>;
  }) => {
    await csrf();

    setErrors({});
    setStatus(null);

    axios
      .post('/reset-password', {
        token,
        email,
        password,
        password_confirmation,
      })
      .then(response =>
        router.push('/login?reset=' + btoa(response.data.status)),
      )
      .catch(error => {
        if (error.response.status !== 422) throw error;

        setErrors(error.response.data.errors);
      });
  };

  const resendEmailVerification = ({
    setStatus,
  }: {
    setStatus: Dispatch<SetStateAction<string | null>>;
  }) => {
    axios
      .post('/email/verification-notification')
      .then(response => setStatus(response.data.status));
  };

  const logout = useCallback(async () => {
    if (!error) {
      await axios.post('/logout').then(() => mutate());
    }

    window.location.pathname = '/login';
  }, [error, mutate]);

  useEffect(() => {
    if (middleware === 'guest' && redirectIfAuthenticated && user)
      router.push(redirectIfAuthenticated);
    if (
      window.location.pathname === '/verify-email' &&
      user?.email_verified_at !== undefined &&
      redirectIfAuthenticated !== undefined
    ) {
      router.push(redirectIfAuthenticated);
    }
    if (middleware === 'auth' && error) logout();
  }, [user, error, middleware, redirectIfAuthenticated, router, logout]);

  return {
    user,
    register,
    login,
    forgotPassword,
    resetPassword,
    resendEmailVerification,
    logout,
  };
};
