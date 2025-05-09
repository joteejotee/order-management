'use client';
import React, { useState, useEffect } from 'react';
import axios from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { Pen, Customer, OrderCreateResponse } from '@/types/index';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// バリデーションスキーマ
const orderSchema = z.object({
  customer_id: z.string().min(1, '顧客を選択してください'),
  pen_id: z.string().min(1, '商品を選択してください'),
  num: z
    .string()
    .min(1, '数量を入力してください')
    .refine(val => !isNaN(Number(val)), {
      message: '数量は数値で入力してください',
    })
    .refine(val => Number(val) >= 1, {
      message: '数量は1以上である必要があります',
    })
    .refine(val => Number(val) <= 20, {
      message: '数量は20以下である必要があります',
    }),
});

type OrderFormData = z.infer<typeof orderSchema>;

const CreateOrder: React.FC = () => {
  const router = useRouter();
  const [pens, setPens] = useState<Pen[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    mode: 'onSubmit',
    defaultValues: {
      customer_id: '',
      pen_id: '',
      num: '',
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response =
          await axios.get<OrderCreateResponse>(`/api/orders/create`);
        setPens(response.data.pens);
        setCustomers(response.data.customers);
      } catch (error) {
        setError('データの取得に失敗しました');
      } finally {
        setIsFetching(false);
      }
    };

    fetchData();
  }, []);

  const onSubmit = async (data: OrderFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      await axios.post(`/api/orders`, {
        pen_id: parseInt(data.pen_id),
        customer_id: parseInt(data.customer_id),
        num: parseInt(data.num),
      });
      router.push('/orders?from=create');
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

  const FormSkeleton = () => {
    return (
      <div className="p-4 bg-white shadow-md rounded-md mx-4 my-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-6" />
          <div className="space-y-4">
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
  };

  if (isFetching) {
    return <FormSkeleton />;
  }

  return (
    <div className="p-4 bg-white shadow-md rounded-md mx-4 my-6">
      <p>顧客と商品、数量を入力して、登録ボタンをクリックしてください</p>
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
        <div className="mb-4">
          <select
            id="customer_id"
            className={`w-full px-3 py-2 bg-gray-100 rounded-md border-none ${
              !errors.customer_id ? '' : 'border-red-500'
            }`}
            {...register('customer_id')}
          >
            <option value="" disabled>
              顧客
            </option>
            {customers.map(customer => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </select>
          {errors.customer_id && (
            <p className="mt-1 text-sm text-red-600">
              {errors.customer_id.message}
            </p>
          )}
        </div>
        <div className="mb-4">
          <select
            id="pen_id"
            className={`w-full px-3 py-2 bg-gray-100 rounded-md border-none ${
              !errors.pen_id ? '' : 'border-red-500'
            }`}
            {...register('pen_id')}
          >
            <option value="" disabled>
              商品
            </option>
            {pens.map(pen => (
              <option key={pen.id} value={pen.id}>
                {pen.name} - {pen.price}円
              </option>
            ))}
          </select>
          {errors.pen_id && (
            <p className="mt-1 text-sm text-red-600">{errors.pen_id.message}</p>
          )}
        </div>
        <div className="mb-4">
          <input
            type="number"
            id="num"
            className="w-full px-3 py-2 bg-gray-100 rounded-md placeholder-gray-400 border-none"
            placeholder="数量"
            {...register('num')}
          />
          {errors.num && (
            <p className="mt-1 text-sm text-red-600">{errors.num.message}</p>
          )}
        </div>
        <div className="flex justify-end mt-6">
          <button
            type="button"
            onClick={() => router.push('/orders')}
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

export default CreateOrder;
