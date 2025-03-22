"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Pen, PaginationMeta } from "@/types";

interface PensResponse {
    data: {
        data: Pen[];
        meta: PaginationMeta;
    };
}

const Pens: React.FC = () => {
    const [pens, setPens] = useState<Pen[]>([]);
    const router = useRouter();
    const [page, setPage] = useState(1);
    const [pageInfo, setPageInfo] = useState<PaginationMeta>({
        current_page: 1,
        from: 1,
        last_page: 1,
        path: "",
        per_page: 10,
        to: 1,
        total: 0,
        next_page_url: null,
        prev_page_url: null,
    });
    const [isLoading, setIsLoading] = useState(false);
    const abortControllerRef = React.useRef<AbortController | null>(null);
    
    // 環境変数を取得し、未定義の場合は本番環境のURLをデフォルト値として使用
    const backendUrl = typeof window !== 'undefined' 
        ? (process.env.NEXT_PUBLIC_BACKEND_URL || 'https://api.order-management1.com')
        : 'https://api.order-management1.com';
    
    // コンポーネントマウント時にコンソールに設定を出力（デバッグ用）
    useEffect(() => {
        console.log('🔍 Pens - Using backendUrl:', backendUrl);
    }, []);

    const getPens = async (pageNum: number) => {
        if (isLoading) return;

        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        const controller = new AbortController();
        abortControllerRef.current = controller;

        setIsLoading(true);
        try {
            // APIリクエスト送信前にURLをログ出力
            const requestUrl = `${backendUrl}/api/pens?page=${pageNum}`;
            console.log('📡 Fetching pens from:', requestUrl);
            
            const response = await axios.get<PensResponse>(requestUrl);
            if (abortControllerRef.current === controller) {
                setPens(response.data.data.data);
                setPageInfo(response.data.data.meta);
            }
        } catch (error) {
            if (error instanceof Error) {
                console.error("Failed to fetch pens:", error.message);
            }
        } finally {
            if (abortControllerRef.current === controller) {
                setIsLoading(false);
            }
        }
    };

    useEffect(() => {
        getPens(page);
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [page]);

    const deletePen = async (id: number) => {
        if (confirm("削除しますか？")) {
            try {
                await axios.delete(`${backendUrl}/api/pens/${id}`);
                getPens(page);
            } catch (error) {
                console.error("Failed to delete pen:", error);
            }
        }
    };

    const handleNextPage = () => {
        if (pageInfo?.next_page_url) {
            setPage(page + 1);
        }
    };

    const handlePreviousPage = () => {
        if (pageInfo?.prev_page_url && page > 1) {
            setPage(page - 1);
        }
    };

    return (
        <div className="relative overflow-x-auto">
            <table className="min-w-full divide-y dark:divide-neutral-700">
                <thead>
                    <tr>
                        <th scope="col" className="px-6 py-4">
                            ID
                        </th>
                        <th scope="col" className="px-6 py-4 text-left">
                            名前
                        </th>
                        <th scope="col" className="px-6 py-4 text-left">
                            価格
                        </th>
                        <th scope="col" className="px-6 py-4 text-left">
                            在庫数
                        </th>
                        <th scope="col" className="px-3 py-4" />
                        <th scope="col" className="px-3 py-4">
                            <button
                                className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                                onClick={() => router.push("/pens/create")}
                            >
                                新規登録
                            </button>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {pens.map((pen) => (
                        <tr key={pen.id} className="bg-white border-b">
                            <th scope="row" className="px-6 py-2">
                                {pen.id}
                            </th>
                            <td className="px-6 py-2">{pen.name}</td>
                            <td className="px-6 py-2">{pen.price}円</td>
                            <td className="px-6 py-2">{pen.stock}</td>
                            <td className="px-3 py-2 text-right">
                                <button
                                    className="py-1 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-teal-500 text-white hover:bg-teal-600 disabled:opacity-50 disabled:pointer-events-none"
                                    onClick={() =>
                                        router.push(`/pens/edit/${pen.id}`)
                                    }
                                >
                                    編集
                                </button>
                            </td>
                            <td className="px-3 py-2">
                                <button
                                    className="py-1 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 disabled:pointer-events-none"
                                    onClick={() => deletePen(pen.id)}
                                >
                                    削除
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="w-1/2 items-center px-4 mt-6">
                <div className="join grid grid-cols-2">
                    {pageInfo?.prev_page_url && (
                        <button
                            className="min-h-[38px] min-w-[38px] py-2 px-2.5 inline-flex justify-center items-center gap-x-1.5 text-sm rounded-lg text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-white/10 dark:focus:bg-white/10"
                            onClick={handlePreviousPage}
                        >
                            <svg
                                className="flex-shrink-0 size-3.5"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="m15 18-6-6 6-6" />
                            </svg>
                            <span>PreviousPage</span>
                        </button>
                    )}
                    {pageInfo?.next_page_url && (
                        <button
                            className="min-h-[38px] min-w-[38px] py-2 px-2.5 inline-flex justify-center items-center gap-x-1.5 text-sm rounded-lg text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-white/10 dark:focus:bg-white/10"
                            onClick={handleNextPage}
                        >
                            <span>NextPage</span>
                            <svg
                                className="flex-shrink-0 size-3.5"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="m9 18 6-6-6-6" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Pens;
