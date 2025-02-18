'use client';

import { useAuth } from '@/hooks/auth';
import Navigation from '@/app/(app)/Navigation';
import Loading from './Loading';
import { useRouter } from 'next/navigation';
import React from 'react';
import { User } from '@/types/user';

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { user, isValidating } = useAuth({
    middleware: 'auth',
  }) as { user: User | null; isValidating: boolean };

  if (isValidating) {
    return <Loading />;
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation user={user} />
      <main>{children}</main>
    </div>
  );
};

export default AppLayout;
