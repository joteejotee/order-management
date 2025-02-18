'use client';

import { useAuth } from '@/hooks/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const Dashboard = () => {
  const router = useRouter();
  const { user, isValidating } = useAuth({ middleware: 'auth' });

  useEffect(() => {
    if (!isValidating && !user) {
      router.push('/login');
    }
  }, [user, isValidating, router]);

  if (isValidating || !user) {
    return <div>Loading...</div>;
  }

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
