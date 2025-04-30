'use client';

import { useAuth } from '@/hooks/auth';
import { useEffect, useState } from 'react';

const DashboardPage = () => {
  const [mounted, setMounted] = useState(false);
  const { user, isValidating } = useAuth({
    middleware: 'auth',
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isValidating) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4" />
        <div className="text-gray-600">ロード中...</div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 bg-white border-b border-gray-200">
              <div>ようこそ {user.data.name} さん！</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="text-center p-4">
        ユーザー情報が見つかりません。再ログインしてください。
      </div>
      <button
        onClick={() => {
          window.location.href = '/login';
        }}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        ログイン画面へ
      </button>
    </div>
  );
};

export default DashboardPage;
