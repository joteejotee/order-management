'use client';
import React, { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { Pen, PaginationMeta } from '@/types';

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

  const getPens = async (pageNum: number) => {
    if (isLoading) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    try {
      console.log('APIリクエスト開始:', `/api/pens?page=${pageNum}`);
      const response = await axios.get(`/api/pens?page=${pageNum}`, {
        signal: controller.signal,
      });
      console.log('API レスポンス 成功:', response.data);
      console.log('API レスポンス ステータス:', response.status);
      console.log('API レスポンス データ構造:', Object.keys(response.data));

      if (abortControllerRef.current === controller) {
        if (response.data && response.data.data) {
          setPens(response.data.data.data);
          setPageInfo({
            current_page: response.data.data.current_page,
            from: response.data.data.from,
            last_page: response.data.data.last_page,
            path: response.data.data.path,
            per_page: response.data.data.per_page,
            to: response.data.data.to,
            total: response.data.data.total,
            next_page_url: response.data.data.next_page_url,
            prev_page_url: response.data.data.prev_page_url,
          });
          console.log('ページネーション情報:', {
            current_page: response.data.data.current_page,
            last_page: response.data.data.last_page,
            next_page_url: response.data.data.next_page_url,
            prev_page_url: response.data.data.prev_page_url,
          });
          console.log('ステート更新完了: setPens と setPageInfo を実行');
        } else {
          console.error('API レスポンスの形式が予期しない形式:', response.data);
        }
      }
    } catch (error) {
      // カスタムキャンセルエラーを確認
      if ((error as any)?._isSilent || (error as any)?.isCanceled) {
        console.log('リクエストがキャンセルされました - 正常な動作');
        return; // キャンセルの場合は静かに終了、UIは更新しない
      }

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
    } finally {
      if (abortControllerRef.current === controller) {
        setIsLoading(false);
        console.log('ローディング状態をfalseに設定');
      }
    }
  };

  useEffect(() => {
    getPens(page);

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
    console.log(' pens の中身:', pens);
    console.log(' pageInfo の中身:', pageInfo);
  }, [pens, pageInfo]);

  const deletePen = async (id: number) => {
    if (confirm('削除しますか？')) {
      try {
        await axios.delete(`/api/pens/${id}`);
        getPens(page);
      } catch (error) {
        console.error('Failed to delete pen:', error);
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
    <div className="relative overflow-x-auto p-4">
      <table className="min-w-full dark:divide-neutral-700">
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
                onClick={() => router.push('/pens/create')}
              >
                新規登録
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {pens && pens.length > 0 ? (
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
