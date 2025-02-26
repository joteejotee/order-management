'use client';

import { useAuth } from '@/hooks/auth';
import Navigation from '@/app/(app)/Navigation';
import Loading from './Loading';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { User } from '@/types/user';

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { user, isValidating, csrf } = useAuth({
    middleware: 'auth',
  }) as { user: User | null; isValidating: boolean; csrf: () => Promise<any> };

  // コンポーネントのマウント時に実行
  useEffect(() => {
    console.log('AppLayout - Component mounted');
    setMounted(true);

    // CSRFトークンを事前に取得
    csrf().then(() => {
      console.log('AppLayout - CSRF token refreshed');
    });
  }, []);

  // ユーザー状態の変更を監視
  useEffect(() => {
    console.log('AppLayout - Auth State:', { user, isValidating, mounted });

    if (mounted && !isValidating && !user) {
      console.log('AppLayout - No user found, redirecting to login');
      window.location.href = '/login';
    }
  }, [user, isValidating, mounted]);

  if (!mounted || isValidating) {
    return <Loading />;
  }

  if (!user) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation user={user} />
      <main>{children}</main>
    </div>
  );
};

export default AppLayout;
