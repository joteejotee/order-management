'use client';
import React, { useEffect, useState, useRef } from 'react';
import axios from '@/lib/axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { Order, PaginationMeta } from '@/types';

interface OrdersResponse {
  data: Order[];
  meta: PaginationMeta;
}

const TableSkeleton = () => {
  return (
    <>
      {[...Array(4)].map((_, index) => (
        <tr
          key={index}
          className="animate-pulse bg-white border-b border-gray-200"
        >
          <td className="px-6 py-2">
            <div className="h-4 bg-gray-200 rounded-full w-8"></div>
          </td>
          <td className="px-6 py-2">
            <div className="h-4 bg-gray-200 rounded-full w-24"></div>
          </td>
          <td className="px-6 py-2">
            <div className="h-4 bg-gray-200 rounded-full w-32"></div>
          </td>
          <td className="px-6 py-2">
            <div className="h-4 bg-gray-200 rounded-full w-12"></div>
          </td>
          <td className="px-6 py-2">
            <div className="h-4 bg-gray-200 rounded-full w-20"></div>
          </td>
          <td className="px-6 py-2">
            <div className="h-4 bg-gray-200 rounded-full w-36"></div>
          </td>
          <td className="px-6 py-2">
            <div className="h-6 bg-gray-200 rounded-full w-16"></div>
          </td>
          <td className="px-3 py-2">
            <div className="h-8 bg-gray-200 rounded-lg w-16"></div>
          </td>
          <td className="px-3 py-2">
            <div className="h-8 bg-gray-200 rounded-lg w-16"></div>
          </td>
        </tr>
      ))}
    </>
  );
};

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [page, setPage] = useState(1);
  const [highlightedId, setHighlightedId] = useState<number | null>(null);
  const [pageInfo, setPageInfo] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isFirstRender = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const getOrders = async (pageNum: number) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    try {
      console.log(
        'APIリクエスト開始:',
        `${backendUrl}/api/orders?page=${pageNum}`,
      );
      const response = await axios.get(`/api/orders?page=${pageNum}`, {
        signal: controller.signal,
      });
      console.log('API レスポンス 成功:', response.data);
      console.log('API レスポンス ステータス:', response.status);
      console.log('API レスポンス データ構造:', Object.keys(response.data));

      if (abortControllerRef.current === controller) {
        if (response.data && response.data.data) {
          setOrders(response.data.data);

          // 初回レンダリング時かつ新規登録からの遷移時のみハイライトを表示
          if (
            isFirstRender.current &&
            searchParams.get('from') === 'create' &&
            response.data.data.length > 0
          ) {
            const newOrder = response.data.data[0];
            setHighlightedId(newOrder.id);
            setTimeout(() => {
              setHighlightedId(null);
            }, 100);
          }
          isFirstRender.current = false;

          const metaData = response.data.meta;
          console.log('ページネーション メタデータ (raw):', metaData);
          console.log('last_page:', metaData.last_page);
          console.log('current_page:', metaData.current_page);
          console.log('next_page_url:', metaData.next_page_url);

          setPageInfo({
            current_page: metaData.current_page,
            from: metaData.from || 0,
            last_page: metaData.last_page || 1,
            path: metaData.path || '',
            per_page: metaData.per_page,
            to: metaData.to || 0,
            total: metaData.total,
            next_page_url: metaData.next_page_url,
            prev_page_url: metaData.prev_page_url,
          });
          console.log('ページネーション情報:', {
            current_page: metaData.current_page,
            last_page: metaData.last_page,
            next_page_url: metaData.next_page_url,
            prev_page_url: metaData.prev_page_url,
          });
          console.log('ステート更新完了: setOrders と setPageInfo を実行');
        } else {
          console.error('API レスポンスの形式が予期しない形式:', response.data);
          setOrders([]);
        }
      }
    } catch (error) {
      console.error('APIリクエスト失敗 - 詳細:');
      if (error instanceof Error) {
        console.error('エラーメッセージ:', error.message);
        console.error('エラータイプ:', error.name);
        console.error('スタックトレース:', error.stack);
      }

      if (axios.isAxiosError(error)) {
        console.error('Axiosエラー設定:', error.config);
        console.error('Axiosエラーレスポンス:', error.response);
        console.error('Axiosエラーリクエスト:', error.request);
      }

      console.error('エラーの完全な内容:', error);
      setOrders([]);
    } finally {
      if (abortControllerRef.current === controller) {
        setIsLoading(false);
        console.log('ローディング状態をfalseに設定');
      }
    }
  };

  useEffect(() => {
    getOrders(page);

    // グローバルナビゲーションイベントのリスナーを追加
    const handleNavigation = () => {
      console.log('Navigation detected, aborting pending requests');
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };

    window.addEventListener('navigationStart', handleNavigation);

    return () => {
      window.removeEventListener('navigationStart', handleNavigation);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [page]);

  useEffect(() => {
    console.log('orders の中身:', orders);
    console.log('pageInfo の中身:', pageInfo);
  }, [orders, pageInfo]);

  const deleteOrder = async (id: number) => {
    if (confirm('本当に削除しますか？')) {
      try {
        await axios.delete(`/api/orders/${id}`);
        getOrders(page);
      } catch (error) {
        console.error('Failed to delete order:', error);
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

  // ステータス更新関数を追加
  const toggleStatus = async (order: Order) => {
    // 即時にUIを更新
    const optimisticOrders = orders.map(o =>
      o.id === order.id
        ? { ...o, status: o.status === 'pending' ? 'shipped' : 'pending' }
        : o,
    );
    setOrders(optimisticOrders);

    try {
      await axios.put(`/api/orders/${order.id}`, {
        status: order.status === 'pending' ? 'shipped' : 'pending',
      });
    } catch (error) {
      // エラー時は元に戻す
      setOrders(orders);
      console.error('Failed to update status:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="relative overflow-x-auto p-4">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
          <thead>
            <tr className="border-b border-gray-200">
              <th scope="col" className="px-6 py-4">
                注文ID
              </th>
              <th scope="col" className="px-6 py-4 text-left">
                顧客
              </th>
              <th scope="col" className="px-6 py-4 text-left">
                商品名
              </th>
              <th scope="col" className="px-6 py-4 text-left">
                数量
              </th>
              <th scope="col" className="px-6 py-4 text-left">
                合計金額
              </th>
              <th scope="col" className="px-6 py-4 text-left">
                注文日
              </th>
              <th scope="col" className="px-6 py-4 text-left">
                出荷
              </th>
              <th scope="col" className="px-3 py-4" />
              <th scope="col" className="px-3 py-4">
                <button
                  className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                  onClick={() => router.push('/orders/create')}
                >
                  新規登録
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <TableSkeleton />
            ) : orders && orders.length > 0 ? (
              orders.map(order => (
                <tr
                  key={order.id}
                  className={`border-b border-gray-200 transition-all duration-700 ease-out ${
                    highlightedId === order.id
                      ? 'bg-yellow-200'
                      : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  <th scope="row" className="px-6 py-2">
                    {order.id}
                  </th>
                  <td className="px-6 py-2">
                    {order.customer?.name || 'データなし'}
                  </td>
                  <td className="px-6 py-2">
                    {order.pen?.name || 'データなし'}
                  </td>
                  <td className="px-6 py-2">{order.quantity}</td>
                  <td className="px-6 py-2">
                    {order.pen
                      ? new Intl.NumberFormat('ja-JP').format(
                          order.pen.price * order.quantity,
                        )
                      : 0}
                    円
                  </td>
                  <td className="px-6 py-2">
                    {order.orderday
                      ? new Date(order.orderday).toLocaleString('ja-JP', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: false,
                        })
                      : 'データなし'}
                  </td>
                  <td className="px-6 py-2">
                    <button
                      onClick={() => toggleStatus(order)}
                      className={`px-2 py-1 text-xs font-medium rounded-full cursor-pointer ${
                        order.status === 'pending'
                          ? 'text-red-800 bg-red-100'
                          : 'text-blue-800 bg-blue-100'
                      }`}
                    >
                      {order.status === 'pending' ? '未出荷' : '出荷済'}
                    </button>
                  </td>
                  <td className="px-3 py-2 text-right">
                    <button
                      className="py-1 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-teal-500 text-white hover:bg-teal-600 disabled:opacity-50 disabled:pointer-events-none"
                      onClick={() => router.push(`/orders/edit/${order.id}`)}
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
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center">
                  {isLoading ? '読み込み中...' : 'データがありません'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="w-1/2 items-center px-4 mt-6">
          <div className="flex gap-x-2">
            {pageInfo && (page > 1 || pageInfo.prev_page_url) && (
              <button
                className="min-h-[38px] min-w-[38px] py-2 px-2.5 inline-flex justify-center items-center gap-x-1.5 text-sm rounded-lg text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none"
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
                <span>前へ</span>
              </button>
            )}
            {pageInfo && (pageInfo.last_page > page || pageInfo.next_page_url) && (
              <button
                className="min-h-[38px] min-w-[38px] py-2 px-2.5 inline-flex justify-center items-center gap-x-1.5 text-sm rounded-lg text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none"
                onClick={handleNextPage}
              >
                <span>次へ</span>
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
    </div>
  );
};

export default Orders;
