'use client';

import { useAuth } from '@/hooks/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();
  const { user, isValidating } = useAuth();

  useEffect(() => {
    if (!isValidating) {
      if (user) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    }
  }, [user, isValidating, router]);

  // ローディング表示（3秒後にタイムアウト）
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isValidating) {
        router.push('/login'); // タイムアウト時はログインページへ
      }
    }, 3000);

    return () => clearTimeout(timeout);
  }, [isValidating, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-700 mx-auto mb-4" />
        <div className="text-gray-600">Loading...</div>
      </div>
    </div>
  );
}
