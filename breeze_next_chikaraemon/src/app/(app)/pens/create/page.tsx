'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const http = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true,
});

const CreatePage = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [nameMessage, setNameMessage] = useState('');
  const [priceMessage, setPriceMessage] = useState('');
  const router = useRouter();

  const createPen = async () => {
    const requestBody = {
      name: name,
      price: price,
    };
    http
      .post('/api/pens', requestBody, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(() => {
        router.push('/pens');
      })
      .catch(function (error) {
        console.log(error.response.data.errors.name);
        console.log(error.response.data.errors.price);
        setNameMessage(error.response.data.errors.name);
        setPriceMessage(error.response.data.errors.price);
      });
  };

  return (
    <div className="relative p-3">
      <div className="flex flex-col bg-white border shadow-sm rounded-xl p-4 md:p-5 dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-neutral-700/70">
        <div className="py-2 px-4">
          <p>ペンの名前と価格を入力して、登録ボタンをクリックしてください</p>
        </div>
        <input
          type="text"
          className="my-3 peer py-3 px-4 ps-11 block w-full bg-gray-100 border-transparent rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-700 dark:border-transparent dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
          placeholder="名前"
          onChange={e => {
            setName(e.target.value);
          }}
        />
        <div className="ml-4 text-red-500">{nameMessage}</div>
        <input
          type="text"
          className="my-3 peer py-3 px-4 ps-11 block w-full bg-gray-100 border-transparent rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-700 dark:border-transparent dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
          placeholder="価格"
          onChange={e => {
            setPrice(e.target.value);
          }}
        />
        <div className="ml-4 text-red-500">{priceMessage}</div>
        <div>
          <button
            className="my-3 py-3 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
            onClick={() => {
              createPen();
            }}
          >
            登録
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePage;
