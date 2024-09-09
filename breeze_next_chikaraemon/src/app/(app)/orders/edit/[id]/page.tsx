"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const http = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true,
  withXSRFToken: true,
});

const EditPage = ({ params }: { params: { id: string } }) => {
  const [customer_id, setCustomer_id] = useState('');
  const [customer_idMessage, setCustomer_idMessage] = useState('');

  const [pen_id, setPen_id] = useState('');
  const [pen_idMessage, setPen_idMessage] = useState('');

  const [num, setNum] = useState('');
  const [numMessage, setNumMessage] = useState('');

  const [order, setOrder] = useState<any>({});

  const router = useRouter();

  //以下　pens customers 取得のための処理
  const [pens, setPens] = useState({});
  const [customers, setCustomers] = useState({});
  const getOrder = async () => {
    const response = await fetch(`http://localhost:8000/api/orders/${params.id}`);
    const json = await response.json();
    console.log(json.data);
    setOrder(json.data);
    console.log(json.pens);
    console.log(json.customers);
    setPens(json.pens);
    setCustomers(json.customers);
  }

  useEffect(() => {
    getOrder();
  }, []);

  const updateOrder = async () => {
    const requestBody = {
      customer_id: order.customer_id,
      pen_id: order.pen_id,
      num: order.num,
    };

    console.log(requestBody);

    // この1行下がAPIリクエスト
    http.patch(`/api/orders/${order.id}`, requestBody, {
      headers: {
        'Content-Type': 'application/json'
      },
    }).then(() => {
      router.push('/orders');
    }).catch(function (error) {
      console.log(error.response.data.errors.customer_id);
      console.log(error.response.data.errors.pen_id);
      console.log(error.response.data.errors.num);
      setCustomer_idMessage(error.response.data.errors.customer_id);
      setPen_idMessage(error.response.data.errors.pen_id)
      setNumMessage(error.response.data.errors.num)
    });
  }

  return (
    <div className="relative p-3">
      <div className='flex flex-col bg-white border shadow-sm rounded-xl p-4 md:p-5 dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-neutral-700/70'>
        <div className="py-2 px-4">
          <p>IDが{params.id}の注文の顧客IDとペンID、注文数を入力して、登録ボタンをクリックしてください</p>
        </div>
        <select id="customerSelect"
          onChange={(e) => {
            setOrder({
              ...order,
              customer_id: e.target.value
            });
          }}
          className="my-3 py-3 px-4 pe-9 block w-full bg-gray-100 border-transparent rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-700 dark:border-transparent dark:text-neutral-400 dark:focus:ring-neutral-600">
          <option value="">顧客を選択してください</option>
          {Array.isArray(customers) && customers.map((customer) => (
            <option key={customer.id} value={customer.id} selected={customer.id === order.customer_id}>{customer.name}</option>
          ))}
        </select>
        <div className='ml-4 text-red-500'>{customer_idMessage}</div>
        <select id="penSelect"
          onChange={(e) => {
            setOrder({
              ...order,
              pen_id: e.target.value
            });
          }}
          className="my-3 py-3 px-4 pe-9 block w-full bg-gray-100 border-transparent rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-700 dark:border-transparent dark:text-neutral-400 dark:focus:ring-neutral-600">
          <option value="">ペンを選択してください</option>
          {Array.isArray(pens) && pens.map((pen) => (
            <option key={pen.id} value={pen.id} selected={pen.id === order.pen_id}>{pen.name}</option>
          ))}
        </select>
        <div className='ml-4 text-red-500'>{pen_idMessage}</div>
        <input
          type="text"
          className='my-3 peer py-3 px-2 ps-11 block w-full bg-gray-100 border-transparent rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-700 dark:border-transparent dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600'
          placeholder='数量'
          defaultValue={order.num}
          onChange={(e) => {
            setOrder({
              ...order,
              num: e.target.value
            });
          }}
        />
        <div className='ml-4 text-red-500'>{numMessage}</div>
        <div>
          <button
            className="my-3 py-3 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-teal-500 text-white hover:bg-teal-600 disabled:opacity-50 disabled:pointer-events-none"
            onClick={() => {
              updateOrder();
            }}
          >編集</button>
        </div>
      </div>
    </div>
  );
}
export default EditPage;
