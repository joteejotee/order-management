import { lazy } from 'react';
import type {
  LoginCredentials,
  RegisterCredentials,
  ResetPasswordCredentials,
  ForgotPasswordRequest,
  EmailVerificationRequest,
} from './authTypes';

// 認証関数の動的インポート
export async function loadAuthFunctions() {
  const module = await import('./authFunctions');
  return {
    fetchUser: module.fetchUser,
    performLogin: module.performLogin,
    performLogout: module.performLogout,
    performRegister: module.performRegister,
    performResetPassword: module.performResetPassword,
    performForgotPassword: module.performForgotPassword,
    performResendEmailVerification: module.performResendEmailVerification,
  };
}

// 特定の認証機能だけを動的にロード
export async function loadLoginFunction() {
  const { performLogin } = await import('./authFunctions');
  return performLogin;
}

export async function loadLogoutFunction() {
  const { performLogout } = await import('./authFunctions');
  return performLogout;
}

export async function loadRegisterFunction() {
  const { performRegister } = await import('./authFunctions');
  return performRegister;
}

export async function loadResetPasswordFunction() {
  const { performResetPassword } = await import('./authFunctions');
  return performResetPassword;
}

export async function loadForgotPasswordFunction() {
  const { performForgotPassword } = await import('./authFunctions');
  return performForgotPassword;
}

export async function loadResendEmailVerificationFunction() {
  const { performResendEmailVerification } = await import('./authFunctions');
  return performResendEmailVerification;
}
