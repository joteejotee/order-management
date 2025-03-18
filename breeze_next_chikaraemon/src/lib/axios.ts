import axios, { AxiosInstance, AxiosResponse } from "axios";

const axiosInstance: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
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
    return config;
});

// レスポンスインターセプター（エラーハンドリング）
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // 認証エラーの場合、ログインページにリダイレクト
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
    axiosInstance.interceptors.request.use(request => {
        console.log('Starting Request:', request);
        return request;
    });

    axiosInstance.interceptors.response.use(response => {
        console.log('Response:', response);
        return response;
    });
}

export default axiosInstance;
// 環境変数の値を確認しました
