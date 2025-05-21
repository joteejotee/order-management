'use client';

import { useAuth } from '@/hooks/auth';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/types';
import { LoadingOverlay } from '@/components/ui/loading-overlay';

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

  return <LoadingOverlay />;
};

export default Home;
