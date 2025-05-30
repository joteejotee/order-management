'use client';
import React, { useEffect, useState, useRef, Suspense } from 'react';
import axios from '@/lib/axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { Pen, PaginationMeta } from '@/types';
import useSWR from 'swr';
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

// fetcherの定義を追加
const fetcher = async (url: string) => {
  const response = await axios.get(url);
  return response.data;
};

interface PensResponse {
  data: {
    data: Pen[];
    current_page: number;
    from: number;
    last_page: number;
    path: string;
    per_page: number;
    to: number;
    total: number;
    next_page_url: string | null;
    prev_page_url: string | null;
  };
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
            <div className="h-4 bg-gray-200 rounded-full w-8" />
          </td>
          <td className="px-6 py-2">
            <div className="h-4 bg-gray-200 rounded-full w-32" />
          </td>
          <td className="px-6 py-2">
            <div className="h-4 bg-gray-200 rounded-full w-16" />
          </td>
          <td className="px-6 py-2">
            <div className="h-4 bg-gray-200 rounded-full w-12" />
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

// 検索パラメータを使用するコンポーネントを分離
function PensWithSearchParams() {
  const [pens, setPens] = useState<Pen[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [page, setPage] = useState(1);
  const [highlightedId, setHighlightedId] = useState<number | null>(null);
  const isFirstRender = useRef(true);
  const [pageInfo, setPageInfo] = useState<PaginationMeta>({
    current_page: 1,
    from: 1,
    last_page: 1,
    path: '',
    per_page: 10,
    to: 1,
    total: 0,
    next_page_url: null,
    prev_page_url: null,
  });
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const abortControllerRef = React.useRef<AbortController | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [penToDelete, setPenToDelete] = useState<number | null>(null);

  // SWRの設定を最適化
  const {
    data: swrResponse,
    mutate,
    isValidating,
  } = useSWR<PensResponse>(`/api/pens?page=${page}`, fetcher, {
    revalidateOnFocus: true,
    revalidateIfStale: true,
    dedupingInterval: 2000,
    keepPreviousData: true,
    suspense: false,
    refreshInterval: 0,
    errorRetryCount: 3,
    onSuccess: data => {
      if (data?.data) {
        setPens(data.data.data);

        // 新規登録後の遷移かどうかを確認
        const isFromCreate = searchParams.get('from') === 'create';

        if (
          isFirstRender.current &&
          isFromCreate &&
          data.data.data.length > 0
        ) {
          const newPen = data.data.data[0];
          setHighlightedId(newPen.id);
          setTimeout(() => {
            setHighlightedId(null);
          }, 100);
          isFirstRender.current = false;
        }

        setPageInfo({
          current_page: data.data.current_page,
          from: data.data.from,
          last_page: data.data.last_page,
          path: data.data.path,
          per_page: data.data.per_page,
          to: data.data.to,
          total: data.data.total,
          next_page_url: data.data.next_page_url,
          prev_page_url: data.data.prev_page_url,
        });
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

  useEffect(() => {
    // ペンと画面情報の確認ロジック
  }, [pens, pageInfo]);

  // ページネーションでページが切り替わったときにエラーをクリア
  useEffect(() => {
    setDeleteError(null);
  }, [page]);

  const handleDeleteClick = (id: number) => {
    setPenToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!penToDelete || !swrResponse?.data) return;

    const optimisticData = {
      data: {
        ...swrResponse.data,
        data: swrResponse.data.data.filter(pen => pen.id !== penToDelete),
      },
    };

    try {
      setDeleteError(null);
      mutate(optimisticData, false);
      await axios.delete(`/api/pens/${penToDelete}`);
      mutate();
    } catch (error: unknown) {
      mutate(swrResponse);
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        setDeleteError(
          error.response.data?.message ||
            'このペンは注文に紐づいているため削除できません',
        );
      } else {
        setDeleteError('削除に失敗しました。再度お試しください。');
      }
    } finally {
      setIsDeleteDialogOpen(false);
      setPenToDelete(null);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="relative overflow-x-auto p-4">
        {deleteError && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {deleteError}
          </div>
        )}
        <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
          <thead>
            <tr className="border-b border-gray-200">
              <th scope="col" className="px-6 py-4">
                商品ID
              </th>
              <th scope="col" className="px-6 py-4 text-left">
                商品名
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
                  onClick={() => router.push('/pens/create')}
                >
                  新規登録
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {isValidating ? (
              <TableSkeleton />
            ) : pens && pens.length > 0 ? (
              pens.map(pen => (
                <tr
                  key={pen.id}
                  className={`border-b border-gray-200 transition-all duration-700 ease-out ${
                    highlightedId === pen.id
                      ? 'bg-yellow-200'
                      : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  <th scope="row" className="px-6 py-2">
                    {pen.id}
                  </th>
                  <td className="px-6 py-2">{pen.name}</td>
                  <td className="px-6 py-2">{pen.price}円</td>
                  <td className="px-6 py-2">{pen.stock}</td>
                  <td className="px-3 py-2 text-right">
                    <button
                      className="p-2 text-black hover:text-gray-400 disabled:opacity-50 disabled:pointer-events-none"
                      onClick={() => router.push(`/pens/edit/${pen.id}`)}
                    >
                      <Pencil className="h-5 w-5 font-bold" strokeWidth={2.5} />
                    </button>
                  </td>
                  <td className="px-3 py-2">
                    <button
                      className="p-2 text-black hover:text-gray-400 disabled:opacity-50 disabled:pointer-events-none"
                      onClick={() => handleDeleteClick(pen.id)}
                    >
                      <Trash2 className="h-5 w-5 font-bold" strokeWidth={2.5} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center">
                  ペンが見つかりませんでした。
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
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>商品の削除</DialogTitle>
            <DialogDescription>
              本当にこの商品を削除しますか？
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
    </div>
  );
}

// メインコンポーネント
const Pens: React.FC = () => {
  return (
    <Suspense fallback={<div className="p-8">ローディング中...</div>}>
      <PensWithSearchParams />
    </Suspense>
  );
};

export default Pens;
