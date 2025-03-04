"use client";

import useSWR, { SWRResponse } from "swr";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ApiResponse, User } from "@/types";

interface LoginCredentials {
    email: string;
    password: string;
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

interface AuthHook {
    user: User | undefined;
    isValidating: boolean;
    isLoading: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => Promise<void>;
    register: (credentials: RegisterCredentials) => Promise<void>;
    resetPassword: (credentials: ResetPasswordCredentials) => Promise<void>;
    forceRefresh: () => Promise<void>;
    clearCache: () => void;
}

interface AuthConfig {
    middleware?: string;
    redirectIfAuthenticated?: string;
}

export function useAuth({
    middleware,
    redirectIfAuthenticated,
}: AuthConfig = {}): AuthHook {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isRouting, setIsRouting] = useState(false);
    const [localUser, setLocalUser] = useState<User | undefined>(undefined);
    const [cacheKey, setCacheKey] = useState<string>(
        `/api/user?t=${Date.now()}`
    );

    // ユーザーデータをローカルストレージから取得する試み
    useEffect(() => {
        try {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                setLocalUser(parsedUser);
                console.log(
                    "Auth - Loaded user from localStorage:",
                    parsedUser
                );
            }
        } catch (error) {
            console.error(
                "Auth - Error loading user from localStorage:",
                error
            );
        }
    }, []);

    // キャッシュをクリアする関数
    const clearCache = () => {
        try {
            localStorage.removeItem("user");
            setLocalUser(undefined);
            setCacheKey(`/api/user?t=${Date.now()}`);
            console.log("Auth - Cache cleared, new key:", cacheKey);
        } catch (error) {
            console.error("Auth - Error clearing cache:", error);
        }
    };

    const fetchUser = async () => {
        try {
            console.log("Auth - Fetching user data with key:", cacheKey);
            const response = await axios.get<ApiResponse<User>>("/api/user", {
                headers: {
                    "Cache-Control": "no-cache, no-store, must-revalidate",
                    Pragma: "no-cache",
                    Expires: "0",
                    "X-Requested-With": "XMLHttpRequest",
                    "X-Timestamp": Date.now().toString(),
                },
            });

            const userData = response.data;
            console.log("Auth - User data response:", userData);

            // ユーザーデータをローカルストレージに保存
            if (userData?.data) {
                try {
                    localStorage.setItem("user", JSON.stringify(userData.data));
                    setLocalUser(userData.data);
                } catch (error) {
                    console.error(
                        "Auth - Error saving user to localStorage:",
                        error
                    );
                }
            }

            return userData;
        } catch (error) {
            console.error("Auth - Error fetching user data:", error);
            return null;
        }
    };

    // SWRの設定を最適化
    const {
        data,
        error,
        mutate,
        isValidating,
    }: SWRResponse<ApiResponse<User> | null, any> = useSWR(
        cacheKey,
        fetchUser,
        {
            revalidateIfStale: false,
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            refreshInterval: 0,
            dedupingInterval: 0, // 重複リクエストを完全に防止
            shouldRetryOnError: true,
            errorRetryCount: 3,
            focusThrottleInterval: 10000,
            loadingTimeout: 3000,
            onSuccess: (data: ApiResponse<User> | null) => {
                console.log("Auth - SWR onSuccess:", data);
            },
            onError: (err: any) => {
                console.error("Auth - SWR onError:", err);
            },
            fallbackData: localUser
                ? ({ data: localUser } as ApiResponse<User>)
                : undefined,
        }
    );

    // 強制的にデータを再取得するメソッド
    const forceRefresh = async () => {
        console.log("Auth - Force refreshing user data");
        // キャッシュキーを更新して強制的に再取得
        const newKey = `/api/user?t=${Date.now()}`;
        setCacheKey(newKey);
        console.log("Auth - New cache key:", newKey);
        return mutate();
    };

    const login = async ({ email, password }: LoginCredentials) => {
        setIsLoading(true);
        try {
            // CSRFトークンを取得
            console.log("Auth - Requesting CSRF token");
            await axios.get("/sanctum/csrf-cookie");

            // ログイン処理
            console.log("Auth - Sending login request");
            await axios.post("/api/login", {
                email,
                password,
                remember: false,
            });

            // キャッシュキーを更新
            const newKey = `/api/user?t=${Date.now()}`;
            setCacheKey(newKey);
            await mutate();
            setIsRouting(true);
            window.location.href = "/dashboard"; // フルページリロードを強制
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        setIsLoading(true);
        try {
            await axios.post("/logout");
            // ローカルストレージからユーザー情報を削除
            clearCache();
            await mutate(null, { revalidate: false });
            setIsRouting(true);
            window.location.href = "/login"; // フルページリロードを強制
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const register = async ({
        name,
        email,
        password,
        password_confirmation,
        setErrors,
    }: RegisterCredentials) => {
        setErrors({});

        axios
            .post("/register", {
                name,
                email,
                password,
                password_confirmation,
            })
            .then(() => {
                // キャッシュキーを更新
                const newKey = `/api/user?t=${Date.now()}`;
                setCacheKey(newKey);
                mutate();
                window.location.href = "/dashboard"; // フルページリロードを強制
            })
            .catch((error) => {
                if (error.response?.data?.errors) {
                    setErrors(error.response.data.errors);
                }
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
        setErrors({});
        setStatus(null);

        axios
            .post("/reset-password", {
                email,
                password,
                password_confirmation,
                token,
            })
            .then((response) => {
                window.location.href =
                    "/login?reset=" + btoa(response.data.status); // フルページリロードを強制
            })
            .catch((error) => {
                if (error.response?.data?.errors) {
                    setErrors(error.response.data.errors);
                }
            });
    };

    // ミドルウェアの効果を処理
    useEffect(() => {
        if (!isValidating) {
            const authState = {
                path: window.location.pathname,
                user: data?.data || localUser,
                error,
                middleware,
                redirectIfAuthenticated,
                isRouting,
                cacheKey,
            };
            console.log("Auth - Middleware Effect:", authState);

            // 未認証ユーザーのリダイレクト
            if (middleware === "auth" && error && !localUser) {
                window.location.href = "/login"; // フルページリロードを強制
            }

            // 認証済みユーザーのリダイレクト
            if (redirectIfAuthenticated && (data?.data || localUser)) {
                window.location.href = redirectIfAuthenticated; // フルページリロードを強制
            }
        }
    }, [
        data,
        localUser,
        error,
        middleware,
        redirectIfAuthenticated,
        isValidating,
        isRouting,
        cacheKey,
    ]);

    // ルーティング状態をリセットするエフェクト
    useEffect(() => {
        if (isRouting) {
            const timer = setTimeout(() => {
                setIsRouting(false);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [isRouting]);

    // 実際のユーザーデータ（APIレスポンスまたはローカルストレージから）
    const actualUser = data?.data || localUser;

    return {
        user: actualUser,
        login,
        logout,
        register,
        resetPassword,
        isLoading,
        isValidating,
        forceRefresh,
        clearCache,
    };
}
