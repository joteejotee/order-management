import Axios from 'axios';

const axios = Axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_BACKEND_URL || 'https://api.order-management1.com',
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// CSRFトークンを自動的に処理するインターセプター
axios.interceptors.request.use(config => {
  // クッキーからCSRFトークンを取得
  const token = getCookie('XSRF-TOKEN');
  if (token) {
    config.headers['X-XSRF-TOKEN'] = decodeURIComponent(token);
  }
  return config;
});

// レスポンスインターセプター（エラーハンドリング）
axios.interceptors.response.use(
  response => response,
  error => {
    // 開発環境でのみエラーログを出力
    if (process.env.NODE_ENV === 'development') {
      console.error('Axios error:', error.response || error);
    }

    // CSRFトークンエラーの場合、自動的にトークンを再取得
    if (error.response?.status === 419) {
      console.warn('CSRF token mismatch detected, refreshing token...');
      // ページをリロードせずにCSRFトークンを再取得
      return axios.get('/sanctum/csrf-cookie').then(() => {
        // 元のリクエストを再試行
        return axios(error.config);
      });
    }

    return Promise.reject(error);
  },
);

// クッキーを取得するヘルパー関数
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }

  return null;
}

export default axios;
