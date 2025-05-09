'use client';
import React, { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { Pen } from '@/types';

interface EditPenFormProps {
  penId: string;
}

const FormSkeleton = () => (
  <div className="p-4 bg-white shadow-md rounded-md mx-4 my-6">
    <div className="animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-6" />
      <div className="space-y-4">
        <div className="h-10 bg-gray-200 rounded w-full" />
        <div className="h-10 bg-gray-200 rounded w-full" />
        <div className="h-10 bg-gray-200 rounded w-full" />
        <div className="h-10 bg-gray-200 rounded w-full" />
        <div className="flex justify-end mt-6 space-x-4">
          <div className="h-10 bg-gray-200 rounded w-24" />
          <div className="h-10 bg-gray-200 rounded w-24" />
        </div>
      </div>
    </div>
  </div>
);

const EditPenForm: React.FC<EditPenFormProps> = ({ penId }) => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPen = async () => {
      try {
        const response = await axios.get<{ data: Pen }>(`/api/pens/${penId}`);
        const pen = response.data.data;
        setName(pen.name);
        setPrice(pen.price.toString());
        setStock(pen.stock.toString());
      } catch (error) {
        // エラー処理
      } finally {
        setIsFetching(false);
      }
    };
    fetchPen();
  }, [penId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await axios.patch(`/api/pens/${penId}`, {
        name,
        price: parseInt(price),
        stock: parseInt(stock),
      });
      await router.push('/pens');
      router.refresh();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('予期せぬエラーが発生しました');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return <FormSkeleton />;
  }

  return (
    <div className="p-4 bg-white shadow-md rounded-md mx-4 my-6">
      <p>商品情報を入力して、保存ボタンをクリックしてください</p>
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-4">
          <input
            type="text"
            id="name"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full px-3 py-2 bg-gray-100 rounded-md placeholder-gray-400 border-none"
            required
            placeholder="商品名"
          />
        </div>
        <div className="mb-4">
          <input
            type="number"
            id="price"
            value={price}
            onChange={e => setPrice(e.target.value)}
            className="w-full px-3 py-2 bg-gray-100 rounded-md placeholder-gray-400 border-none"
            required
            placeholder="価格"
          />
        </div>
        <div className="mb-4">
          <input
            type="number"
            id="stock"
            value={stock}
            onChange={e => setStock(e.target.value)}
            className="w-full px-3 py-2 bg-gray-100 rounded-md placeholder-gray-400 border-none"
            required
            min="0"
            placeholder="在庫数"
          />
        </div>
        <div className="flex justify-end mt-6">
          <button
            type="button"
            onClick={() => router.push('/pens')}
            className="px-4 py-2 mr-2 bg-gray-200 text-gray-700 rounded-md"
          >
            キャンセル
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            {isLoading ? '保存中...' : '保存'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPenForm;
