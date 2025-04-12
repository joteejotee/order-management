'use client';
import React, { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { Order, Pen, Customer } from '@/types';

interface EditOrderProps {
  params: {
    id: string;
  };
}

interface EditOrderData extends Order {
  customer_id: number;
  num: number;
}

interface EditOrderResponse {
  data: EditOrderData;
  pens: Pen[];
  customers: Customer[];
}

const EditOrder: React.FC<EditOrderProps> = ({ params }) => {
  const router = useRouter();
  const [pens, setPens] = useState<Pen[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedPen, setSelectedPen] = useState<string>('');
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<EditOrderResponse>(
          `${backendUrl}/api/orders/${params.id}/edit`,
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
        console.error('Failed to fetch data:', error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchData();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await axios.put(`${backendUrl}/api/orders/${params.id}`, {
        pen_id: parseInt(selectedPen),
        customer_id: parseInt(selectedCustomer),
        num: parseInt(quantity),
      });
      router.push('/orders');
    } catch (error) {
      console.error('Failed to update order:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePenChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPen(e.target.value);
  };

  const handleCustomerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCustomer(e.target.value);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(e.target.value);
  };

  if (isFetching) {
    return <div>読み込み中...</div>;
  }

  return (
    <div className="p-4 bg-white shadow-md rounded-md mx-4 my-6">
      <p>顧客と商品、数量を入力して、保存ボタンをクリックしてください</p>
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
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.push('/orders')}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            キャンセル
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? '保存中...' : '保存'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditOrder;
