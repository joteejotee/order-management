'use client';
import React, { useState } from 'react';
import axios from '@/lib/axios';
import { useRouter } from 'next/navigation';

interface CreatePenFormData {
  name: string;
  price: string;
  stock: string;
}

const CreatePen = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<CreatePenFormData>({
    name: '',
    price: '',
    stock: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await axios.post(`/api/pens`, {
        name: formData.name,
        price: parseInt(formData.price),
        stock: parseInt(formData.stock),
      });
      router.push('/pens?from=create');
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

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
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="商品名"
            className="w-full px-3 py-2 bg-gray-100 rounded-md placeholder-gray-400 border-none"
          />
        </div>
        <div className="mb-4">
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            min="0"
            placeholder="価格"
            className="w-full px-3 py-2 bg-gray-100 rounded-md placeholder-gray-400 border-none"
          />
        </div>
        <div className="mb-4">
          <input
            type="number"
            id="stock"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            required
            min="0"
            placeholder="在庫数"
            className="w-full px-3 py-2 bg-gray-100 rounded-md placeholder-gray-400 border-none"
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

export default CreatePen;
