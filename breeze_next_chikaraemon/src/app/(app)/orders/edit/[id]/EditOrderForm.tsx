'use client';
import React, { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { Pen, Customer, Order } from '@/types';

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

const EditOrderForm: React.FC<EditOrderFormProps> = ({ orderId }) => {
  const router = useRouter();
  const [pens, setPens] = useState<Pen[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedPen, setSelectedPen] = useState<string>('');
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<EditOrderResponse>(
          `${backendUrl}/api/orders/${orderId}/edit`,
        );
        const {
          data: order,
          pens: pensData,
          customers: customersData,
        } = response.data;
        setSelectedPen(order.pen_id.toString());
        setSelectedCustomer(order.customer_id.toString());
        setQuantity(order.num.toString());
        setPens(pensData);
        setCustomers(customersData);
      } catch (error) {
        // エラー処理
      } finally {
        setIsFetching(false);
      }
    };
    fetchData();
  }, [orderId, backendUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await axios.patch(`${backendUrl}/api/orders/${orderId}`, {
        pen_id: parseInt(selectedPen),
        customer_id: parseInt(selectedCustomer),
        num: parseInt(quantity),
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
    <div className="p-4 bg-white shadow-md rounded-md mx-4 my-6">
      <p>顧客と商品、数量を入力して、保存ボタンをクリックしてください</p>
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-4">
          <select
            id="customer_id"
            value={selectedCustomer}
            onChange={e => setSelectedCustomer(e.target.value)}
            className={`w-full px-3 py-2 bg-gray-100 rounded-md border-none ${selectedCustomer === '' ? 'text-gray-400' : 'text-gray-900'}`}
            required
          >
            <option value="" disabled hidden>
              顧客
            </option>
            {customers.map(customer => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <select
            id="pen_id"
            value={selectedPen}
            onChange={e => setSelectedPen(e.target.value)}
            className={`w-full px-3 py-2 bg-gray-100 rounded-md border-none ${selectedPen === '' ? 'text-gray-400' : 'text-gray-900'}`}
            required
          >
            <option value="" disabled hidden>
              商品
            </option>
            {pens.map(pen => (
              <option key={pen.id} value={pen.id}>
                {pen.name} - {pen.price}円
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <input
            type="number"
            id="quantity"
            value={quantity}
            onChange={e => setQuantity(e.target.value)}
            className="w-full px-3 py-2 bg-gray-100 rounded-md placeholder-gray-400 border-none"
            required
            min="1"
            placeholder="数量"
          />
        </div>
        <div className="flex justify-end space-x-4">
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

export default EditOrderForm;
