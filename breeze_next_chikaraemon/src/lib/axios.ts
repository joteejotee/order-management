import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig, AxiosError } from "axios";

// 環境変数の型宣言
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_BACKEND_URL?: string;
      NODE_ENV?: 'development' | 'production';
    }
  }
}

// 環境変数のログ出力
console.log('🌍 NEXT_PUBLIC_BACKEND_URL:', process.env.NEXT_PUBLIC_BACKEND_URL);

// バックエンドURLのデフォルト値を設定
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://api.order-management1.com';
console.log('🌐 Using backendUrl:', backendUrl);

const axiosInstance: AxiosInstance = axios.create({
    baseURL: backendUrl,
    headers: {
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json",
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

// CSRFトークンを自動的に処理するインターセプター
axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    // クッキーからCSRFトークンを取得
    const token = getCookie("XSRF-TOKEN");
    if (token) {
        config.headers["X-XSRF-TOKEN"] = decodeURIComponent(token);
    }
    
    // リクエストURLを詳細にログ出力
    console.log('🔍 Complete Request URL:', config.baseURL + config.url);
    console.log('🔧 Request Config:', {
        baseURL: config.baseURL,
        url: config.url,
        method: config.method,
        withCredentials: config.withCredentials
    });
    
    return config;
});

// レスポンスインターセプター（エラーハンドリング）
axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
        // APIリクエストではリダイレクトをスキップ
        const isApiRequest = error.config?.url?.startsWith('/api/');
        
        if (error.response?.status === 401 && !isApiRequest) {
            // APIリクエスト以外の認証エラーの場合のみ、ログインページにリダイレクト
            window.location.href = "/login";
            return Promise.reject(error);
        }
        console.error("Axios error:", error.response || error);
        return Promise.reject(error);
    }
);

// クッキーを取得するヘルパー関数
function getCookie(name: string): string | null {
    if (typeof document === "undefined") return null;

    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);

    if (parts.length === 2) {
        return parts.pop()?.split(";").shift() || null;
    }

    return null;
}

// 開発時のデバッグ用
if (process.env.NODE_ENV === "development") {
    axiosInstance.interceptors.request.use((request: InternalAxiosRequestConfig) => {
        console.log('Starting Request:', request);
        return request;
    });

    axiosInstance.interceptors.response.use((response: AxiosResponse) => {
        console.log('Response:', response);
        return response;
    });
}

export default axiosInstance;
// 環境変数の値を確認しました
