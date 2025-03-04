import useSWR from 'swr';
import axios from '@/lib/axios';
import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface AuthProps {
  middleware?: 'auth' | 'guest';
  redirectIfAuthenticated?: string | undefined;
}

interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string;
}

interface ErrorResponse {
  response: {
    status: number;
    data: {
      errors: Record<string, string[]>;
    };
  };
}

interface LoginCredentials {
  email: string;
  password: string;
  remember: boolean;
  setErrors: (errors: any) => void;
  setStatus: (status: string | null) => void;
}

interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  setErrors: (errors: any) => void;
}

interface ResetPasswordCredentials {
  email: string;
  password: string;
  password_confirmation: string;
  token: string;
  setErrors: (errors: any) => void;
  setStatus: (status: string | null) => void;
}

const DEBUG_MODE = true;

export const useAuth = ({
  middleware,
  redirectIfAuthenticated,
}: AuthProps = {}) => {
  const router = useRouter();

  const { data: user, error, mutate, isValidating } = useSWR<User | null>(
    '/api/user',
    () =>
      axios
        .get('/api/user')
        .then(res => {
          console.log('Auth - User data response:', res.data);
          return res.data;
        })
        .catch(error => {
          console.error('Auth - Error fetching user:', error);
          if (error.response?.status !== 401) {
            throw error;
          }
          return null;
        }),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      revalidateOnReconnect: false,
      dedupingInterval: 2000,
    },
  );

  const csrf = useCallback(() => {
    if (DEBUG_MODE) console.log('Fetching CSRF token...');
    return axios.get('/sanctum/csrf-cookie');
  }, []);

  const register = async ({
    name,
    email,
    password,
    password_confirmation,
    setErrors,
  }: RegisterCredentials) => {
    await csrf();
    setErrors([]);

    axios
      .post('/register', { name, email, password, password_confirmation })
      .then(() => mutate())
      .catch((error: ErrorResponse) => {
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
  }: LoginCredentials) => {
    setErrors({});
    setStatus(null);

    try {
      // CSRFトークンを取得
      console.log('Auth - Requesting CSRF token');
      await axios.get('/sanctum/csrf-cookie');

      // ログイン処理
      console.log('Auth - Sending login request');
      await axios.post('/login', {
        email,
        password,
        remember,
      });

      mutate();
      router.push('/dashboard');
    } catch (error) {
      if (error instanceof Error) {
        console.error('Login error:', error);
      }

      const errorResponse = error as ErrorResponse;
      if (errorResponse.response?.status === 422) {
        setErrors(errorResponse.response.data.errors);
      } else {
        throw error;
      }
    }
  };

  const forgotPassword = async ({
    setErrors,
    setStatus,
    email,
  }: {
    setErrors: (errors: any) => void;
    setStatus: (status: string | null) => void;
    email: string;
  }) => {
    await csrf();
    setErrors([]);
    setStatus(null);

    axios
      .post('/forgot-password', { email })
      .then(response => setStatus(response.data.status))
      .catch((error: ErrorResponse) => {
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
  }: ResetPasswordCredentials) => {
    await csrf();
    setErrors([]);
    setStatus(null);

    axios
      .post('/reset-password', {
        email,
        password,
        password_confirmation,
        token,
      })
      .then(response =>
        router.push('/login?reset=' + btoa(response.data.status)),
      )
      .catch((error: ErrorResponse) => {
        if (error.response.status !== 422) throw error;
        setErrors(error.response.data.errors);
      });
  };

  const resendEmailVerification = ({
    setStatus,
  }: {
    setStatus: (status: string) => void;
  }) => {
    axios
      .post('/email/verification-notification')
      .then(response => setStatus(response.data.status));
  };

  const logout = useCallback(async () => {
    if (!error) {
      await axios.post('/logout');
      mutate();
    }

    window.location.pathname = '/login';
  }, [error, mutate]);

  useEffect(() => {
    console.log('Auth - Middleware Effect:', {
      path: window.location.pathname,
      user,
      error,
      middleware,
      redirectIfAuthenticated,
      isValidating,
    });

    if (middleware === 'guest' && redirectIfAuthenticated && user) {
      console.log(
        'Auth - Redirecting authenticated user from guest page to:',
        redirectIfAuthenticated,
      );
      window.location.href = redirectIfAuthenticated;
    }

    if (
      window.location.pathname === '/verify-email' &&
      user?.email_verified_at &&
      redirectIfAuthenticated
    ) {
      console.log('Auth - Redirecting verified user from verification page');
      window.location.href = redirectIfAuthenticated;
    }

    if (middleware === 'auth' && error && !isValidating) {
      console.log('Auth - Unauthorized user detected, logging out');
      logout();
    }
  }, [
    user,
    error,
    logout,
    middleware,
    redirectIfAuthenticated,
    router,
    isValidating,
  ]);

  return {
    user,
    register,
    login,
    forgotPassword,
    resetPassword,
    resendEmailVerification,
    logout,
    csrf,
    isValidating,
  };
};
