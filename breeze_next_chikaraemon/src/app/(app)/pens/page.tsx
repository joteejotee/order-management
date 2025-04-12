'use client';
import React, { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { Pen, PaginationMeta } from '@/types';
import useSWR from 'swr';

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
            <div className="h-4 bg-gray-200 rounded-full w-8"></div>
          </td>
          <td className="px-6 py-2">
            <div className="h-4 bg-gray-200 rounded-full w-32"></div>
          </td>
          <td className="px-6 py-2">
            <div className="h-4 bg-gray-200 rounded-full w-16"></div>
          </td>
          <td className="px-6 py-2">
            <div className="h-4 bg-gray-200 rounded-full w-12"></div>
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

const Pens: React.FC = () => {
  const [pens, setPens] = useState<Pen[]>([]);
  const router = useRouter();
  const [page, setPage] = useState(1);
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
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = React.useRef<AbortController | null>(null);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  // SWRの設定を最適化
  const { data: swrResponse, mutate, isValidating } = useSWR<PensResponse>(
    `/api/pens?page=${page}`,
    fetcher,
    {
      revalidateOnFocus: false, // フォーカス時の再検証を無効化
      revalidateIfStale: false, // 古いデータの自動再検証を無効化
      dedupingInterval: 5000, // 5秒間は同じリクエストを重複させない
      keepPreviousData: true, // 新しいデータがロードされるまで古いデータを表示
      onSuccess: data => {
        if (data?.data) {
          setPens(data.data.data);
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

          // プリフェッチを非同期で実行
          const prefetchNextPage = async () => {
            if (data.data.next_page_url) {
              try {
                await fetcher(`/api/pens?page=${data.data.current_page + 1}`);
              } catch (error) {
                console.error('Failed to prefetch next page:', error);
              }
            }
          };

          const prefetchPrevPage = async () => {
            if (data.data.prev_page_url) {
              try {
                await fetcher(`/api/pens?page=${data.data.current_page - 1}`);
              } catch (error) {
                console.error('Failed to prefetch previous page:', error);
              }
            }
          };

          // プリフェッチを実行（ただし現在のページのデータ取得後）
          if (!isValidating) {
            prefetchNextPage();
            prefetchPrevPage();
          }
        }
      },
      onError: error => {
        console.error('Failed to fetch pens:', error);
      },
    },
  );

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    console.log(' pens の中身:', pens);
    console.log(' pageInfo の中身:', pageInfo);
  }, [pens, pageInfo]);

  const deletePen = async (id: number) => {
    if (!swrResponse?.data) return;

    // 即時にUIを更新（オプティミスティックUI）
    const optimisticData = {
      data: {
        ...swrResponse.data,
        data: swrResponse.data.data.filter(pen => pen.id !== id),
      },
    };

    try {
      mutate(optimisticData, false);
      await axios.delete(`/api/pens/${id}`);
      mutate(); // サーバーから最新データを取得
    } catch (error) {
      mutate(swrResponse); // エラー時は元のデータに戻す
      console.error('Failed to delete pen:', error);
    }
  };

  const handleNextPage = () => {
    if (swrResponse?.data?.next_page_url) {
      setPage(page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (swrResponse?.data?.prev_page_url && page > 1) {
      setPage(page - 1);
    }
  };

  return (
    <div className="relative overflow-x-auto p-4">
      <table className="min-w-full dark:divide-neutral-700">
        <thead>
          <tr>
            <th scope="col" className="px-6 py-4">
              商品ID
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
                onClick={() => router.push('/pens/create')}
              >
                新規登録
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {isLoading || isValidating ? (
            <TableSkeleton />
          ) : pens && pens.length > 0 ? (
            pens.map(pen => (
              <tr key={pen.id} className="bg-white border-b border-gray-200">
                <th scope="row" className="px-6 py-2">
                  {pen.id}
                </th>
                <td className="px-6 py-2">{pen.name}</td>
                <td className="px-6 py-2">{pen.price}円</td>
                <td className="px-6 py-2">{pen.stock}</td>
                <td className="px-3 py-2 text-right">
                  <button
                    className="py-1 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-teal-500 text-white hover:bg-teal-600 disabled:opacity-50 disabled:pointer-events-none"
                    onClick={() => router.push(`/pens/edit/${pen.id}`)}
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
      <div className="w-1/2 items-center px-4 mt-6">
        <div className="flex gap-x-2">
          {page > 1 && (
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
              <span>PreviousPage</span>
            </button>
          )}
          {pageInfo.last_page > page && (
            <button
              className="min-h-[38px] min-w-[38px] py-2 px-2.5 inline-flex justify-center items-center gap-x-1.5 text-sm rounded-lg text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none"
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
