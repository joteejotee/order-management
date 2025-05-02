'use client';

import { useAuth } from '@/hooks/auth';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/types';

const Home = () => {
  const router = useRouter();
  const { user } = useAuth() as { user: User | null | undefined };

  useEffect(() => {
    if (user === null) {
      router.push('/login');
    } else if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-700 mx-auto mb-4" />
        <div className="text-gray-600">Loading...</div>
      </div>
    </div>
  );
};

export default Home;
