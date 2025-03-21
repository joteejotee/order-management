"use client";
import React, { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";
import { Order, PaginationMeta } from "@/types";

interface OrdersResponse {
    data: {
        data: Order[];
        meta: PaginationMeta;
    };
}

const Orders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
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
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    const getOrders = async (pageNum: number) => {
        if (isLoading) return;

        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        const controller = new AbortController();
        abortControllerRef.current = controller;

        setIsLoading(true);
        try {
            const response = await axios.get<OrdersResponse>(
                `${backendUrl}/api/orders?page=${pageNum}`
            );
            if (abortControllerRef.current === controller) {
                setOrders(response.data.data.data);
                setPageInfo(response.data.data.meta);
            }
        } catch (error) {
            if (error instanceof Error) {
                console.error("Failed to fetch orders:", error.message);
            }
        } finally {
            if (abortControllerRef.current === controller) {
                setIsLoading(false);
            }
        }
    };

    useEffect(() => {
        getOrders(page);
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [page]);

    const deleteOrder = async (id: number) => {
        if (confirm("削除しますか？")) {
            try {
                await axios.delete(`${backendUrl}/api/orders/${id}`);
                getOrders(page);
            } catch (error) {
                console.error("Failed to delete order:", error);
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
                            ペン
                        </th>
                        <th scope="col" className="px-6 py-4 text-left">
                            数量
                        </th>
                        <th scope="col" className="px-6 py-4 text-left">
                            合計金額
                        </th>
                        <th scope="col" className="px-6 py-4 text-left">
                            ステータス
                        </th>
                        <th scope="col" className="px-3 py-4" />
                        <th scope="col" className="px-3 py-4">
                            <button
                                className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                                onClick={() => router.push("/orders/create")}
                            >
                                新規登録
                            </button>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order.id} className="bg-white border-b">
                            <th scope="row" className="px-6 py-2">
                                {order.id}
                            </th>
                            <td className="px-6 py-2">{order.pen.name}</td>
                            <td className="px-6 py-2">{order.quantity}</td>
                            <td className="px-6 py-2">
                                {order.pen.price * order.quantity}円
                            </td>
                            <td className="px-6 py-2">
                                {order.status === "pending" ? (
                                    <span className="px-2 py-1 text-xs font-medium text-yellow-800 bg-yellow-100 rounded-full">
                                        未発送
                                    </span>
                                ) : (
                                    <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                                        発送済み
                                    </span>
                                )}
                            </td>
                            <td className="px-3 py-2 text-right">
                                <button
                                    className="py-1 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-teal-500 text-white hover:bg-teal-600 disabled:opacity-50 disabled:pointer-events-none"
                                    onClick={() =>
                                        router.push(`/orders/edit/${order.id}`)
                                    }
                                >
                                    編集
                                </button>
                            </td>
                            <td className="px-3 py-2">
                                <button
                                    className="py-1 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 disabled:pointer-events-none"
                                    onClick={() => deleteOrder(order.id)}
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

export default Orders;
