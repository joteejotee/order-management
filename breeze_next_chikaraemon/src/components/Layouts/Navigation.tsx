'use client';

import { useAuth } from '@/hooks/auth';
import Link from 'next/link';

const Navigation = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/dashboard">
                <span className="text-xl font-bold">App</span>
              </Link>
            </div>
          </div>

          <div className="flex items-center">
            {user?.name}
            <button
              onClick={logout}
              className="ml-4 font-medium text-gray-500 hover:text-gray-700"
            >
              ログアウト
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
