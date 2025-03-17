'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from '@/lib/axios';

//この関数が呼ばれると、ペンの一覧が表示される
const Pens = () => {
  const [pens, setPens] = useState<any[]>([]);
  const router = useRouter();
  const [currentUrl, setCurrentUrl] = useState('/api/pens');

  interface PageInfo {
    next_page_url?: string;
    prev_page_url?: string;
    [key: string]: any;
  }

  const [info, setInfo] = useState<PageInfo>({});

  //この関数が呼ばれると、ペンの一覧が取得される
  const getPens = async () => {
    try {
      const response = await axios.get(currentUrl);
      const data = response.data;

      console.log(data.data);

      //変更json.data → json.data.data
      setPens(data.data.data);
      //追加
      setInfo(data.data);
      console.log(data.data);
    } catch (error) {
      console.error('ペンの取得に失敗しました', error);
    }
  };

  //関数useEffectは、このコンポーネントが初期化（画面に表示）された時に呼ばれる。
  // currentUrl が変更されたときに getPens を呼び出す
  useEffect(() => {
    getPens();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUrl]);

  const deletePen = async (id: number) => {
    if (confirm('削除しますか？')) {
      try {
        await axios.delete(`/api/pens/${id}`);
        getPens();
      } catch (error) {
        console.error('削除に失敗しました', error);
      }
    }
  };
  //追加
  const handleNextPage = () => {
    if (info.next_page_url) {
      // 完全なURLから相対パスに変換する
      const url = new URL(info.next_page_url);
      setCurrentUrl(url.pathname + url.search);
    }
  };
  //追加
  const handlePreviousPage = () => {
    if (info.prev_page_url) {
      // 完全なURLから相対パスに変換する
      const url = new URL(info.prev_page_url);
      setCurrentUrl(url.pathname + url.search);
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
            <th scope="col" className="px-3 py-4" />
            <th scope="col" className="px-3 py-4">
              <button
                className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                onClick={() => {
                  router.push('/pens/create');
                }}
              >
                新規登録
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {pens.map((pen: any) => {
            return (
              <tr key={pen.id} className="bg-white border-b">
                <th scope="row" className="px-6 py-2">
                  {pen.id}
                </th>
                <td className="px-6 py-2">{pen.name}</td>
                <td className="px-6 py-2">{pen.price}円</td>
                <td className="px-3 py-2 text-right">
                  <button
                    className="py-1 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-teal-500 text-white hover:bg-teal-600 disabled:opacity-50 disabled:pointer-events-none"
                    onClick={() => {
                      router.push(`/pens/edit/${pen.id}`);
                    }}
                  >
                    編集
                  </button>
                </td>
                <td className="px-3 py-2">
                  <button
                    className="py-1 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 disabled:pointer-events-none"
                    onClick={() => {
                      deletePen(pen.id);
                    }}
                  >
                    削除
                  </button>
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
export default Pens;
