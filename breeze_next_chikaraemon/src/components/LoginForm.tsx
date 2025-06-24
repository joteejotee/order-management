'use client';
import * as React from 'react';
import axios from '@/lib/axios'; // 共通のaxiosインスタンスを使用
import { useTransition } from 'react';
import { Spinner } from './ui/spinner';

const LoginForm = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [isTransitioning, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    startTransition(async () => {
      try {
        // CSRFトークンを取得
        console.log('CSRFトークンを取得中...');
        await axios.get('/sanctum/csrf-cookie', {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        });
        console.log('CSRFトークンの取得成功');

        // ログイン処理
        console.log('ログイン処理を開始...');
        const loginResponse = await axios.post(
          '/api/login',
          {
            email,
            password,
            remember: false,
          },
          {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            withCredentials: true,
          },
        );

        if (loginResponse.status === 200) {
          console.log('ログイン成功');
          window.location.href = '/dashboard';
        }
      } catch (error) {
        console.error('ログインエラー:', error);
        if (axios.isAxiosError(error)) {
          const errorMessage =
            error.response?.data?.message ||
            error.response?.statusText ||
            `HTTPエラー: ${error.response?.status}`;
          setError(`ログインに失敗しました: ${errorMessage}`);
        } else {
          setError('ログインに失敗しました: 不明なエラー');
        }
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          メールアドレス
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          パスワード
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <button
        type="submit"
        disabled={isTransitioning}
        className={`${
          isTransitioning ? 'opacity-95' : ''
        } w-full flex justify-center items-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
      >
        {isTransitioning && <Spinner size="sm" className="text-white" />}
        {isTransitioning ? 'ログイン中...' : 'ログイン'}
      </button>
    </form>
  );
};

export default LoginForm;
