import axios, { AxiosInstance, AxiosResponse } from "axios";

const axiosInstance: AxiosInstance = axios.create({
    // 環境変数ではなく直接URLをハードコード
    baseURL: "https://api.order-management1.com",
    headers: {
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json",
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

// CSRFトークンを自動的に処理するインターセプター
axiosInstance.interceptors.request.use((config) => {
    // クッキーからCSRFトークンを取得
    const token = getCookie("XSRF-TOKEN");
    if (token) {
        config.headers["X-XSRF-TOKEN"] = decodeURIComponent(token);
    }
    
    // リクエストURLを確認用にログ出力
    console.log('🔍 Request URL:', config.baseURL + config.url);
    
    return config;
});

// レスポンスインターセプター（エラーハンドリング）
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("Axios error:", error.response || error);
        return Promise.reject(error);
    }
);

// Helper to get cookie
function getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null;
    
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
}

export default axiosInstance;
// 環境変数の値を確認しました
