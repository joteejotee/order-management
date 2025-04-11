"use client";
import * as React from "react";
import axios from "@/lib/axios"; // 共通のaxiosインスタンスを使用

const LoginForm = () => {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [error, setError] = React.useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Login button clicked", { email, password });
        setError("");

        try {
            // CSRFトークンを取得
            console.log("Requesting CSRF token");
            await axios.get("/sanctum/csrf-cookie");

            // ログイン処理
            console.log("Sending login request");
            const loginResponse = await axios.post("/api/login", {
                email,
                password,
                remember: false,
            });
            console.log("Login Response:", loginResponse);

            if (loginResponse.status === 200) {
                window.location.href = "/dashboard";
            }
        } catch (error) {
            console.error("ログインエラー:", error);
            setError(
                "ログインに失敗しました。メールアドレスとパスワードを確認してください。"
            );
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                >
                    メールアドレス
                </label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                />
            </div>
            <div>
                <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                >
                    パスワード
                </label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                />
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                ログイン
            </button>
        </form>
    );
};

export default LoginForm;
