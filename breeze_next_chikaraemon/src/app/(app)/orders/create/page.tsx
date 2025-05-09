'use client';
import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import axios from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { Pen, Customer, OrderCreateResponse } from '@/types/index';

interface CreateOrderProps {}

const CreateOrder: React.FC<CreateOrderProps> = () => {
  const router = useRouter();
  const [pens, setPens] = useState<Pen[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedPen, setSelectedPen] = useState<string>('');
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response =
          await axios.get<OrderCreateResponse>(`/api/orders/create`);
        setPens(response.data.pens);
        setCustomers(response.data.customers);
      } catch (error) {
        // エラー処理
      } finally {
        setIsFetching(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await axios.post(`/api/orders`, {
        pen_id: parseInt(selectedPen),
        customer_id: parseInt(selectedCustomer),
        num: parseInt(quantity),
      });
      router.push('/orders?from=create');
    } catch (error) {
      // エラー処理
    } finally {
      setIsLoading(false);
    }
  };

  const handlePenChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedPen(e.target.value);
  };

  const handleCustomerChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedCustomer(e.target.value);
  };

  const handleQuantityChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuantity(e.target.value);
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
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-4">
          <select
            id="customer_id"
            value={selectedCustomer}
            onChange={handleCustomerChange}
            className={`w-full px-3 py-2 bg-gray-100 rounded-md border-none ${
              selectedCustomer === '' ? 'text-gray-400' : 'text-gray-900'
            }`}
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
            onChange={handlePenChange}
            className={`w-full px-3 py-2 bg-gray-100 rounded-md border-none ${
              selectedPen === '' ? 'text-gray-400' : 'text-gray-900'
            }`}
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
            onChange={handleQuantityChange}
            className="w-full px-3 py-2 bg-gray-100 rounded-md placeholder-gray-400 border-none"
            required
            min="1"
            placeholder="数量"
          />
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
