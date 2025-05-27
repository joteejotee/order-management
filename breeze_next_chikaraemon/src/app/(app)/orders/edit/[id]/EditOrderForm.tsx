'use client';
import React, { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { Pen, Customer, Order } from '@/types';
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

interface EditOrderData extends Order {
  customer_id: number;
  num: number;
}

interface EditOrderResponse {
  data: EditOrderData;
  pens: Pen[];
  customers: Customer[];
}

interface EditOrderFormProps {
  orderId: string;
}

const FormSkeleton = () => (
  <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="p-4 bg-white shadow-md rounded-md">
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
  </div>
);

const EditOrderForm: React.FC<EditOrderFormProps> = ({ orderId }) => {
  const router = useRouter();
  const [pens, setPens] = useState<Pen[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    mode: 'onSubmit',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<EditOrderResponse>(
          `/api/orders/${orderId}/edit`,
        );
        const {
          data: order,
          pens: pensData,
          customers: customersData,
        } = response.data;

        reset({
          pen_id: order.pen_id.toString(),
          customer_id: order.customer_id.toString(),
          num: order.num.toString(),
        });

        setPens(pensData);
        setCustomers(customersData);
      } catch (error) {
        setError('データの取得に失敗しました');
      } finally {
        setIsFetching(false);
      }
    };
    fetchData();
  }, [orderId, reset]);

  const onSubmit = async (data: OrderFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      await axios.patch(`/api/orders/${orderId}`, {
        pen_id: parseInt(data.pen_id),
        customer_id: parseInt(data.customer_id),
        num: parseInt(data.num),
      });
      await router.push('/orders');
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
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="p-4 bg-white shadow-md rounded-md">
        <p>顧客と商品、数量を入力して、保存ボタンをクリックしてください</p>
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
          <div className="mb-4">
            <select
              id="customer_id"
              className="w-full px-3 py-2 bg-gray-100 rounded-md border-none"
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
              className="w-full px-3 py-2 bg-gray-100 rounded-md border-none"
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
              <p className="mt-1 text-sm text-red-600">
                {errors.pen_id.message}
              </p>
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
              className="mr-2 py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
            >
              {isLoading ? '保存中...' : '保存'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditOrderForm;
