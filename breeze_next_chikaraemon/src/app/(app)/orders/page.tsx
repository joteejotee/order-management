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
import { Pencil, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import useSWR from 'swr';

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

// fetcherの定義を追加
const fetcher = async (
  url: string,
  signal?: AbortSignal, // allow SWR to pass a signal in the future
) => {
  const response = await axios.get(url, { signal });
  return response.data;
};

interface OrdersResponse {
  data: Order[];
  meta: PaginationMeta;
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [page, setPage] = useState(1);
  const [highlightedId, setHighlightedId] = useState<number | null>(null);
  const [pageInfo, setPageInfo] = useState<PaginationMeta | null>(null);
  const isFirstRender = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<number | null>(null);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [orderToUpdateStatus, setOrderToUpdateStatus] = useState<Order | null>(
    null,
  );

  const {
    data: swrResponse,
    mutate,
    isValidating,
  } = useSWR<OrdersResponse>(`/api/orders?page=${page}`, fetcher, {
    revalidateOnFocus: false,
    revalidateIfStale: true,
    dedupingInterval: 2000,
    keepPreviousData: true,
    suspense: false,
    refreshInterval: 0,
    errorRetryCount: 3,
    onSuccess: response => {
      if (response) {
        setOrders(response.data);
        if (
          isFirstRender.current &&
          searchParams.get('from') === 'create' &&
          response.data.length > 0
        ) {
          const newOrder = response.data[0];
          setHighlightedId(newOrder.id);
          setTimeout(() => {
            setHighlightedId(null);
          }, 100);
        }
        isFirstRender.current = false;
        setPageInfo(response.meta);
      }
    },
  });

  useEffect(() => {
    const handleNavigation = () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = new AbortController();
      }
    };

    window.addEventListener('navigationStart', handleNavigation);

    return () => {
      window.removeEventListener('navigationStart', handleNavigation);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const navigateWithEvent = useCallback(
    (path: string) => {
      window.dispatchEvent(new CustomEvent('navigationStart'));
      router.push(path);
    },
    [router],
  );

  const handleDeleteClick = (id: number) => {
    setOrderToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!orderToDelete || !swrResponse?.data) return;
    const optimisticData: OrdersResponse = {
      ...swrResponse,
      data: swrResponse.data.filter(
        (order: Order) => order.id !== orderToDelete,
      ),
    };
    try {
      mutate(optimisticData, false);
      await axios.delete(`/api/orders/${orderToDelete}`);
      mutate();
    } catch (error) {
      mutate(swrResponse);
    } finally {
      setIsDeleteDialogOpen(false);
      setOrderToDelete(null);
    }
  };

  const handleStatusClick = (order: Order) => {
    setOrderToUpdateStatus(order);
    setIsStatusDialogOpen(true);
  };

  const handleStatusConfirm = async () => {
    if (!orderToUpdateStatus || !swrResponse?.data) return;
    const newStatus =
      orderToUpdateStatus.status === 'pending' ? 'shipped' : 'pending';
    const optimisticData: OrdersResponse = {
      ...swrResponse,
      data: swrResponse.data.map((o: Order) =>
        o.id === orderToUpdateStatus.id
          ? { ...o, status: newStatus as 'pending' | 'shipped' }
          : o,
      ),
    };
    try {
      mutate(optimisticData, false);
      const modelData = convertToOrderModel({ status: newStatus });
      await axios.put(`/api/orders/${orderToUpdateStatus.id}`, modelData);
      mutate();
    } catch (error) {
      mutate(swrResponse);
    } finally {
      setIsStatusDialogOpen(false);
      setOrderToUpdateStatus(null);
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
                  onClick={() => navigateWithEvent('/orders/create')}
                >
                  新規登録
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {isValidating ? (
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
                      onClick={() => handleStatusClick(order)}
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
                      className="p-2 text-black hover:text-gray-400 disabled:opacity-50 disabled:pointer-events-none"
                      onClick={() =>
                        navigateWithEvent(`/orders/edit/${order.id}`)
                      }
                    >
                      <Pencil className="h-5 w-5 font-bold" strokeWidth={2.5} />
                    </button>
                  </td>
                  <td className="px-3 py-2">
                    <button
                      className="p-2 text-black hover:text-gray-400 disabled:opacity-50 disabled:pointer-events-none"
                      onClick={() => handleDeleteClick(order.id)}
                    >
                      <Trash2 className="h-5 w-5 font-bold" strokeWidth={2.5} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center">
                  {isValidating ? '読み込み中...' : 'データがありません'}
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
              onPageChange={(newPage: number) => setPage(newPage)}
            />
          )}
        </div>
      </div>
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>注文の削除</DialogTitle>
            <DialogDescription>
              本当にこの注文を削除しますか？
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              キャンセル
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              削除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>出荷状態の変更</DialogTitle>
            <DialogDescription>
              注文を
              {orderToUpdateStatus?.status === 'pending' ? '出荷済' : '未出荷'}
              に変更してよろしいですか？
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsStatusDialogOpen(false)}
            >
              キャンセル
            </Button>
            <Button variant="default" onClick={handleStatusConfirm}>
              変更
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
