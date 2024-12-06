'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000',
  withCredentials: true,
});

const Orders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const router = useRouter();
  const [info, setInfo] = useState<{
    next_page_url?: string;
    prev_page_url?: string;
  }>({});
  const url =
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders` ||
    'http://localhost:8000/api/orders';

  const getOrders = async (url: string) => {
    if (!url) {
      url =
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders` ||
        'http://localhost:8000/api/orders';
    }
    const response = await fetch(url);
    const json = await response.json();
    setOrders(json.data);
    setInfo(json.meta);
  };

  useEffect(() => {
    getOrders(url);
  }, []);

  const deleteOrder = async (id: number) => {
    if (confirm('削除しますか？')) {
      http.delete(`/api/orders/${id}`).then(() => {
        getOrders(url);
      });
    }
  };
  const handleNextPage = () => {
    if (info.next_page_url) {
      getOrders(info.next_page_url);
    }
  };

  const handlePreviousPage = () => {
    if (info.prev_page_url) {
      getOrders(info.prev_page_url);
    }
  };

  const shipOrder = async (id: number) => {
    // 即座にUIを更新
    const updatedOrders = orders.map(order =>
      order.id === id ? { ...order, shipping: 1 } : order,
    );
    setOrders(updatedOrders);

    try {
      await http.put(`/api/orders/${id}`);
    } catch (error: any) {
      // エラー時は元に戻す
      const originalOrders = orders.map(order =>
        order.id === id ? { ...order, shipping: 0 } : order,
      );
      setOrders(originalOrders);
      console.error('出荷状態の更新に失敗しました:', error.message);
    }
  };

  return (
    <div className="relative overflow-x-auto p-5">
      <table className="min-w-full divide-y dark:divide-neutral-700">
        <thead>
          <tr>
            <th scope="col" className="px-6 py-4">
              ID
            </th>
            <th scope="col" className="px-6 py-4 text-left">
              顧客
            </th>
            <th scope="col" className="px-6 py-4 text-left">
              ペン
            </th>
            <th scope="col" className="px-6 py-4 text-left">
              価格
            </th>
            <th scope="col" className="px-6 py-4 text-left">
              注文数
            </th>
            <th scope="col" className="px-6 py-4 text-left">
              注文日
            </th>
            <th scope="col" className="px-6 py-4">
              出荷・未出荷
            </th>
            <th scope="col" className="px-3 py-4">
              <button
                className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                onClick={() => {
                  router.push('/orders/create');
                }}
              >
                新規登録
              </button>
            </th>
            <th scope="col" className="px-3 py-4" />
          </tr>
        </thead>
        <tbody>
          {orders.map((order: any) => {
            return (
              <tr key={order.id} className="bg-white border-b">
                <th scope="row" className="px-6 py-2">
                  {order.id}
                </th>
                <td className="px-6 py-2">{order.customer.name}</td>
                <td className="px-6 py-2">{order.pen.name}</td>
                <td className="px-6 py-2">{order.pen.price}</td>
                <td className="px-6 py-2">{order.num}</td>
                <td className="px-6 py-2">{order.orderday}</td>
                <td className="px-6 py-2 text-center">
                  {order.shipping === 0 ? (
                    <button
                      className="py-1 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-yellow-500 text-white hover:bg-yellow-600 disabled:opacity-50 disabled:pointer-events-none"
                      onClick={() => {
                        shipOrder(order.id);
                      }}
                    >
                      未
                    </button>
                  ) : order.shipping === 1 ? (
                    <span>出荷済</span>
                  ) : null}
                </td>
                <td className="px-3 py-2 text-right">
                  {order.shipping === 0 ? (
                    <button
                      className="py-1 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-teal-500 text-white hover:bg-teal-600 disabled:opacity-50 disabled:pointer-events-none"
                      onClick={() => {
                        router.push(`/orders/edit/${order.id}`);
                      }}
                    >
                      編集
                    </button>
                  ) : null}
                </td>
                <td className="px-3 py-2">
                  {order.shipping === 0 ? (
                    <button
                      className="py-1 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 disabled:pointer-events-none"
                      onClick={() => {
                        deleteOrder(order.id);
                      }}
                    >
                      削除
                    </button>
                  ) : null}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="w-1/2 items-center px-4 mt-6">
        <div className="join grid grid-cols-2">
          {info.prev_page_url ? (
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
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
              <span>PreviousPage</span>
            </button>
          ) : null}
          {info.next_page_url ? (
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
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};
export default Orders;
