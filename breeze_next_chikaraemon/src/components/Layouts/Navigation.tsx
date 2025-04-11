'use client';

import { useAuth } from '@/hooks/auth';
import ApplicationLogo from '@/components/ApplicationLogo';
import NavLink from '@/components/NavLink';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navigation = () => {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  return (
    <nav className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            {/* ロゴ */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/dashboard">
                <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800" />
              </Link>
            </div>

            {/* ナビゲーションリンク */}
            <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
              <NavLink href="/dashboard" active={pathname === '/dashboard'}>
                Dashboard
              </NavLink>
              <NavLink href="/pens" active={pathname === '/pens'}>
                Pens Master
              </NavLink>
              <NavLink href="/orders" active={pathname === '/orders'}>
                Order Master
              </NavLink>
            </div>
          </div>

          {/* ユーザー情報とログアウト */}
          <div className="flex items-center">
            <span className="text-gray-700 px-4">{user?.name}</span>
            <button
              onClick={logout}
              className="font-medium text-gray-500 hover:text-gray-700 focus:outline-none"
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
