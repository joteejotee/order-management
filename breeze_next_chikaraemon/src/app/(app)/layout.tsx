'use client';

import { useAuth } from '@/hooks/auth';
import Navigation from '@/app/(app)/Navigation';
import Loading from './Loading';
import React from 'react'; // Reactの型定義が必要
import { User } from '@/types/user';

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  // 型を明示的に指定
  const { user } = useAuth() as { user: User | null };

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
