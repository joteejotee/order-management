'use client';
import React, { useState } from 'react';
import axios from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// バリデーションスキーマ
const penSchema = z.object({
  name: z
    .string()
    .min(1, '商品名を入力してください')
    .min(3, '商品名は3文字以上である必要があります')
    .max(12, '商品名は12文字以内である必要があります'),
  price: z
    .string()
    .min(1, '価格を入力してください')
    .refine(val => !isNaN(Number(val)), {
      message: '価格は数値で入力してください',
    })
    .refine(val => Number(val) >= 100, {
      message: '価格は100円以上である必要があります',
    })
    .refine(val => Number(val) <= 10000, {
      message: '価格は10000円以下である必要があります',
    }),
  stock: z
    .string()
    .min(1, '在庫数を入力してください')
    .refine(val => !isNaN(Number(val)), {
      message: '在庫数は数値で入力してください',
    })
    .refine(val => Number(val) >= 0, {
      message: '在庫数は0以上である必要があります',
    }),
});

type PenFormData = z.infer<typeof penSchema>;

const CreatePen = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PenFormData>({
    resolver: zodResolver(penSchema),
    mode: 'onSubmit',
    defaultValues: {
      name: '',
      price: '',
      stock: '',
    },
  });

  const onSubmit = async (data: PenFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      await axios.post(`/api/pens`, {
        name: data.name,
        price: parseInt(data.price),
        stock: parseInt(data.stock),
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

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="p-4 bg-white shadow-md rounded-md">
        <p>商品情報を入力して、保存ボタンをクリックしてください</p>
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
          <div className="mb-4">
            <input
              type="text"
              id="name"
              className="w-full px-3 py-2 bg-gray-100 rounded-md placeholder-gray-400 border-none"
              placeholder="商品名"
              {...register('name')}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>
          <div className="mb-4">
            <input
              type="number"
              id="price"
              className="w-full px-3 py-2 bg-gray-100 rounded-md placeholder-gray-400 border-none"
              placeholder="価格"
              {...register('price')}
            />
            {errors.price && (
              <p className="mt-1 text-sm text-red-600">
                {errors.price.message}
              </p>
            )}
          </div>
          <div className="mb-4">
            <input
              type="number"
              id="stock"
              className="w-full px-3 py-2 bg-gray-100 rounded-md placeholder-gray-400 border-none"
              placeholder="在庫数"
              {...register('stock')}
            />
            {errors.stock && (
              <p className="mt-1 text-sm text-red-600">
                {errors.stock.message}
              </p>
            )}
          </div>
          <div className="flex justify-end mt-6">
            <button
              type="button"
              onClick={() => router.push('/pens')}
              className="mr-2 py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none"
              disabled={isLoading}
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
              disabled={isLoading}
            >
              {isLoading ? '保存中...' : '保存'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePen;
