"use client";
import * as React from "react";

const DashboardPage = () => {
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        const loadDashboardData = async () => {
            try {
                // データ取得処理
                setIsLoading(false);
            } catch (err) {
                setError("データの読み込みに失敗しました");
                setIsLoading(false);
            }
        };

        loadDashboardData();
    }, []);

    if (error) return <div>エラー: {error}</div>;
    if (isLoading) return <div>読み込み中...</div>;

    return (
        <div>
            <h1>ダッシュボード</h1>
        </div>
    );
};

export default DashboardPage;
