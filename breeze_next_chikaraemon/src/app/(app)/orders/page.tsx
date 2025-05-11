'use client';
import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  Suspense,
} from 'react';
import axios from '@/lib/axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { Order, PaginationMeta, convertToOrderModel } from '@/types';
import { Pagination } from '@/components/Pagination';

const TableSkeleton = () => {
  return (
    <>
      {[...Array(4)].map((_, index) => (
        <tr
          key={index}
          className="animate-pulse bg-white border-b border-gray-200"
        >
          <td className="px-6 py-2">
            <div className="h-4 bg-gray-200 rounded-full w-8" />
          </td>
          <td className="px-6 py-2">
            <div className="h-4 bg-gray-200 rounded-full w-24" />
          </td>
          <td className="px-6 py-2">
            <div className="h-4 bg-gray-200 rounded-full w-32" />
          </td>
          <td className="px-6 py-2">
            <div className="h-4 bg-gray-200 rounded-full w-12" />
          </td>
          <td className="px-6 py-2">
            <div className="h-4 bg-gray-200 rounded-full w-20" />
          </td>
          <td className="px-6 py-2">
            <div className="h-4 bg-gray-200 rounded-full w-36" />
          </td>
          <td className="px-6 py-2">
            <div className="h-6 bg-gray-200 rounded-full w-16" />
          </td>
          <td className="px-3 py-2">
            <div className="h-8 bg-gray-200 rounded-lg w-16" />
          </td>
          <td className="px-3 py-2">
            <div className="h-8 bg-gray-200 rounded-lg w-16" />
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

  const getOrders = useCallback(
    async (pageNum: number) => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      setIsLoading(true);
      try {
        const response = await axios.get(`/api/orders?page=${pageNum}`, {
          signal: controller.signal,
        });

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
          } else {
            setOrders([]);
          }
        }
      } catch (error) {
        setOrders([]);
      } finally {
        if (abortControllerRef.current === controller) {
          setIsLoading(false);
        }
      }
    },
    [searchParams],
  );

  useEffect(() => {
    getOrders(page);

    // グローバルナビゲーションイベントのリスナーを追加
    const handleNavigation = () => {
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
  }, [page, getOrders]);

  useEffect(() => {
    // orders と pageInfo の変更を監視
  }, [orders, pageInfo]);

  const deleteOrder = async (id: number) => {
    if (confirm('本当に削除しますか？')) {
      try {
        await axios.delete(`/api/orders/${id}`);
        getOrders(page);
      } catch (error) {
        // エラー処理
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
    const newStatus = order.status === 'pending' ? 'shipped' : 'pending';
    const actionText = newStatus === 'shipped' ? '出荷済' : '未出荷';

    // 確認ダイアログを表示
    if (confirm(`注文を${actionText}に変更してよろしいですか？`)) {
      try {
        // モデル変換してAPIリクエストを実行
        const modelData = convertToOrderModel({ status: newStatus });
        const response = await axios.put(`/api/orders/${order.id}`, modelData);

        // レスポンスを確認
        if (response.status === 200) {
          // 成功後にUIを更新
          const updatedOrders = orders.map(o =>
            o.id === order.id
              ? { ...o, status: newStatus as 'pending' | 'shipped' }
              : o,
          );
          setOrders(updatedOrders);
        } else {
          throw new Error('ステータスの更新に失敗しました');
        }
      } catch (error) {
        alert('ステータスの更新に失敗しました。');
      }
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
        <div className="flex justify-center items-center px-4 mt-6">
          {pageInfo && (
            <Pagination
              currentPage={pageInfo.current_page}
              lastPage={pageInfo.last_page}
              onPageChange={page => setPage(page)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default function OrdersPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Orders />
    </Suspense>
  );
}
