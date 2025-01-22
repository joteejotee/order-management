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
        .then(res => res.data)
        .catch(error => {
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
    setErrors,
    ...props
  }: {
    setErrors: (errors: any) => void;
  }) => {
    await csrf();
    setErrors([]);

    axios
      .post('/register', props)
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
    if (DEBUG_MODE)
      console.log('Login attempt with:', { email, password, remember });

    await csrf();
    setErrors([]);
    setStatus(null);

    try {
      if (DEBUG_MODE) console.log('Sending login request...');
      await axios.post('/api/login', { email, password, remember });
      if (DEBUG_MODE) console.log('Login request successful');
      setStatus('success');
      await mutate();
      router.push('/dashboard');
    } catch (error) {
      if (DEBUG_MODE) console.error('Login error:', error);
      setStatus('error');
      if ((error as ErrorResponse).response?.status === 422) {
        setErrors((error as ErrorResponse).response.data.errors);
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
    setErrors,
    setStatus,
    ...props
  }: {
    setErrors: (errors: any) => void;
    setStatus: (status: string | null) => void;
  }) => {
    await csrf();
    setErrors([]);
    setStatus(null);

    axios
      .post('/reset-password', { ...props })
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
    if (middleware === 'guest' && redirectIfAuthenticated && user)
      router.push(redirectIfAuthenticated);
    if (
      window.location.pathname === '/verify-email' &&
      user?.email_verified_at &&
      redirectIfAuthenticated
    )
      router.push(redirectIfAuthenticated);
    if (middleware === 'auth' && error) logout();
  }, [user, error, logout, middleware, redirectIfAuthenticated, router]);

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
