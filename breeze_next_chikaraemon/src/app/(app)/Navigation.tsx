'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/auth';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import ApplicationLogo from '@/components/ApplicationLogo';
import Dropdown from '@/components/Dropdown';
import DropdownLink from '@/components/DropdownLink';
import { User } from '@/types/user';

const Navigation = () => {
  const { user, logout, isValidating, forceRefresh } = useAuth();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    forceRefresh();
  }, []);

  // クライアントサイドナビゲーションを使用
  const handleNavigation = (
    e: React.MouseEvent<HTMLAnchorElement>,
    path: string,
  ) => {
    e.preventDefault();

    // 遷移前にすべてのリクエストをキャンセル
    window.dispatchEvent(new CustomEvent('navigationStart'));

    // 少し時間を置いてからリダイレクト（キャンセル処理の完了を待つ）
    console.log(
      `Navigation - Redirecting to ${path} with client-side navigation`,
    );
    setTimeout(() => {
      router.push(path);
    }, 10);
  };

  return (
    <nav className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <a
                href="/dashboard"
                onClick={e => handleNavigation(e, '/dashboard')}
              >
                <ApplicationLogo className="block h-10 w-auto fill-current text-gray-600" />
              </a>
            </div>

            {/* Navigation Links */}
            <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
              <a
                href="/dashboard"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium leading-5 focus:outline-none transition duration-150 ease-in-out ${
                  pathname === '/dashboard'
                    ? 'border-indigo-400 text-gray-900 focus:border-indigo-700'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:text-gray-700 focus:border-gray-300'
                }`}
                onClick={e => handleNavigation(e, '/dashboard')}
              >
                Dashboard
              </a>
            </div>
            {/* Navigation Links */}
            <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
              <a
                href="/pens"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium leading-5 focus:outline-none transition duration-150 ease-in-out ${
                  pathname === '/pens'
                    ? 'border-indigo-400 text-gray-900 focus:border-indigo-700'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:text-gray-700 focus:border-gray-300'
                }`}
                onClick={e => handleNavigation(e, '/pens')}
              >
                Pen Master
              </a>
            </div>
            {/* Navigation Links */}
            <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
              <a
                href="/orders"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium leading-5 focus:outline-none transition duration-150 ease-in-out ${
                  pathname === '/orders'
                    ? 'border-indigo-400 text-gray-900 focus:border-indigo-700'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:text-gray-700 focus:border-gray-300'
                }`}
                onClick={e => handleNavigation(e, '/orders')}
              >
                Order Master
              </a>
            </div>
          </div>

          {/* Settings Dropdown */}
          <div className="hidden sm:flex sm:items-center sm:ml-6">
            <Dropdown
              align="right"
              width="48"
              trigger={
                <span className="inline-flex rounded-md">
                  <button
                    type="button"
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                  >
                    {isValidating ? '読み込み中...' : user?.name || 'ゲスト'}
                    <svg
                      className="ml-2 -mr-0.5 h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 011.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.25 8.27a.75.75 0 01-.02-1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </span>
              }
            >
              <DropdownLink href="/profile">プロフィール</DropdownLink>
              <DropdownLink href="#" onClick={logout}>
                ログアウト
              </DropdownLink>
            </Dropdown>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
