"use client";
import * as React from "react";
import axios from "axios";

const LoginForm = () => {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Login button clicked", { email, password });

        try {
            // axiosのグローバル設定
            console.log("Setting up axios defaults");
            axios.defaults.baseURL = "http://localhost:8000";
            axios.defaults.withCredentials = true;
            axios.defaults.headers.common = {
                "X-Requested-With": "XMLHttpRequest",
                Accept: "application/json",
                "Content-Type": "application/json",
            };

            // CSRFトークンを取得
            console.log("Requesting CSRF token");
            const csrfResponse = await axios.get("/sanctum/csrf-cookie");
            console.log("CSRF Response:", csrfResponse); // デバッグ用

            // ログイン処理
            console.log("Sending login request");
            const loginResponse = await axios.post("/api/login", {
                email,
                password,
            });
            console.log("Login Response:", loginResponse); // デバッグ用

            if (loginResponse.status === 200) {
                window.location.href = "/dashboard";
            }
        } catch (error) {
            console.error("ログインエラー:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />
            <button type="submit">Login</button>
        </form>
    );
};

export default LoginForm;
