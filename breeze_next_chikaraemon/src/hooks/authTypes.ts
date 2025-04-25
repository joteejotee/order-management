import { ApiResponse } from '@/types';
import type { UserData } from '@/types/user';

// エラーレスポンスの型定義
export interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  setErrors: (errors: Record<string, string[]>) => void;
}

export interface ResetPasswordCredentials {
  email: string;
  password: string;
  password_confirmation: string;
  token: string;
  setErrors: (errors: Record<string, string[]>) => void;
  setStatus: (status: string | null) => void;
}

export interface ForgotPasswordRequest {
  email: string;
  setErrors: (errors: Record<string, string[]>) => void;
  setStatus?: (status: string | null) => void;
}

export interface EmailVerificationRequest {
  setStatus?: (status: string | null) => void;
}

export interface AuthHook {
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

export interface AuthConfig {
  middleware?: string;
  redirectIfAuthenticated?: string;
}
