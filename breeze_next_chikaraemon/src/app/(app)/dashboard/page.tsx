'use client';

import { useAuth } from '@/hooks/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const Dashboard = () => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { user, isValidating, csrf } = useAuth({
    middleware: 'auth',
  });

  // コンポーネントのマウント時に実行
  useEffect(() => {
    console.log('Dashboard - Component mounted');
    setMounted(true);

    // CSRFトークンを事前に取得
    csrf().then(() => {
      console.log('Dashboard - CSRF token refreshed');
    });
  }, []);

  // ユーザー状態の変更を監視
  useEffect(() => {
    console.log('Dashboard - Auth State:', { user, isValidating, mounted });

    if (mounted && !isValidating && !user) {
      console.log('Dashboard - No user found, redirecting to login');
      window.location.href = '/login';
    }
  }, [user, isValidating, mounted]);

  if (!mounted || isValidating || !user) {
    console.log('Dashboard - Loading state');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        <div className="ml-4 text-gray-600">ロード中...</div>
      </div>
    );
  }

  console.log('Dashboard - Rendering dashboard with user:', user);
  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
          <div className="p-6 text-gray-900">ようこそ {user.name} さん！</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
