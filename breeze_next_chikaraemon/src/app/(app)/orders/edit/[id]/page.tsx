'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000',
  withCredentials: true,
});

// 型定義
type Customer = {
  id: string;
  name: string;
};

type Pen = {
  id: string;
  name: string;
};

type Order = {
  id: string;
  customer_id: string;
  pen_id: string;
  num: number;
};

const EditPage = ({ params }: { params: { id: string } }) => {
  const [customer_idMessage, setCustomer_idMessage] = useState<string>('');
  const [pen_idMessage, setPen_idMessage] = useState<string>('');
  const [numMessage, setNumMessage] = useState<string>('');

  // ★ Record<string, any> を Order 型に変更
  const [order, setOrder] = useState<Order>({
    id: '',
    customer_id: '',
    pen_id: '',
    num: 0,
  });

  // ★ Record<string, any>[] を Pen[] 型に変更
  const [pens, setPens] = useState<Pen[]>([]);

  // ★ Record<string, any>[] を Customer[] 型に変更
  const [customers, setCustomers] = useState<Customer[]>([]);

  const router = useRouter();

  const getOrder = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders/${params.id}` ||
        `http://localhost:8000/api/orders/${params.id}`,
    );
    const json = await response.json();
    setOrder(json.data);
    setPens(json.pens);
    setCustomers(json.customers);
  };

  useEffect(() => {
    getOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateOrder = async () => {
    const requestBody = {
      customer_id: order.customer_id,
      pen_id: order.pen_id,
      num: order.num,
    };

    console.log(requestBody);

    // この1行下がAPIリクエスト
    http
      .patch(`/api/orders/${order.id}`, requestBody, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(() => {
        router.push('/orders');
      })
      .catch(function (error) {
        setCustomer_idMessage(error.response.data.errors.customer_id || '');
        setPen_idMessage(error.response.data.errors.pen_id || '');
        setNumMessage(error.response.data.errors.num || '');
      });
  };

  return (
    <div className="relative p-3">
      <div className="flex flex-col bg-white border shadow-sm rounded-xl p-4 md:p-5 dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-neutral-700/70">
        <div className="py-2 px-4">
          <p>
            IDが{params.id}
            の注文の顧客IDとペンID、注文数を入力して、登録ボタンをクリックしてください
          </p>
        </div>
        <select
          id="customerSelect"
          onChange={e => {
            setOrder({
              ...order,
              customer_id: e.target.value,
            });
          }}
          className="my-3 py-3 px-4 pe-9 block w-full bg-gray-100 border-transparent rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-700 dark:border-transparent dark:text-neutral-400 dark:focus:ring-neutral-600"
        >
          <option value="">顧客を選択してください</option>
          {customers.map(customer => (
            <option
              key={customer.id}
              value={customer.id}
              selected={customer.id === order.customer_id}
            >
              {customer.name}
            </option>
          ))}
        </select>
        <div className="ml-4 text-red-500">{customer_idMessage}</div>
        <select
          id="penSelect"
          onChange={e => {
            setOrder({
              ...order,
              pen_id: e.target.value,
            });
          }}
          className="my-3 py-3 px-4 pe-9 block w-full bg-gray-100 border-transparent rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-700 dark:border-transparent dark:text-neutral-400 dark:focus:ring-neutral-600"
        >
          <option value="">ペンを選択してください</option>
          {pens.map(pen => (
            <option
              key={pen.id}
              value={pen.id}
              selected={pen.id === order.pen_id}
            >
              {pen.name}
            </option>
          ))}
        </select>
        <div className="ml-4 text-red-500">{pen_idMessage}</div>
        <input
          type="text"
          className="my-3 peer py-3 px-2 ps-11 block w-full bg-gray-100 border-transparent rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-700 dark:border-transparent dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
          placeholder="数量"
          value={order.num}
          onChange={e => {
            setOrder({
              ...order,
              num: Number(e.target.value),
            });
          }}
        />
        <div className="ml-4 text-red-500">{numMessage}</div>
        <div>
          <button
            className="my-3 py-3 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-teal-500 text-white hover:bg-teal-600 disabled:opacity-50 disabled:pointer-events-none"
            onClick={() => {
              updateOrder();
            }}
          >
            編集
          </button>
        </div>
      </div>
    </div>
  );
};
export default EditPage;
