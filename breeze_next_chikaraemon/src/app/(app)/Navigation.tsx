'use client';

import { useAuth } from '@/hooks/auth';
import { usePathname } from 'next/navigation';
import ApplicationLogo from '@/components/ApplicationLogo';
import Dropdown from '@/components/Dropdown';
import DropdownLink from '@/components/DropdownLink';
import Link from 'next/link';
import { useCallback } from 'react';
const Navigation = () => {
  const { user, logout, isValidating } = useAuth();
  const pathname = usePathname();

  // リンククリック時のイベントをグローバルに通知するための共通関数
  const triggerNavigationEvent = useCallback(() => {
    window.dispatchEvent(new CustomEvent('navigationStart'));
  }, []);

  interface NavLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    active?: boolean;
    href: string;
    children: React.ReactNode;
  }

  // ナビゲーションリンクコンポーネント
  const NavLink = ({ active = false, children, ...props }: NavLinkProps) => (
    <Link
      {...props}
      onClick={e => {
        triggerNavigationEvent();
        // デフォルトのLinkのonClickを保持
        if (props.onClick) {
          props.onClick(e);
        }
      }}
      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium leading-5 focus:outline-none transition duration-150 ease-in-out ${
        active
          ? 'border-indigo-400 text-gray-900 focus:border-indigo-700'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:text-gray-700 focus:border-gray-300'
      }`}
    >
      {children}
    </Link>
  );

  return (
    <nav className="border-b border-gray-100 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/dashboard" onClick={triggerNavigationEvent}>
                <ApplicationLogo className="block h-10 w-auto fill-current text-gray-600" />
              </Link>
            </div>

            {/* Navigation Links */}
            <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
              <NavLink href="/dashboard" active={pathname === '/dashboard'}>
                TOP
              </NavLink>
              <NavLink href="/pens" active={pathname?.startsWith('/pens')}>
                PEN
              </NavLink>
              <NavLink href="/orders" active={pathname === '/orders'}>
                ORDER
              </NavLink>
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
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                  >
                    {isValidating
                      ? '読み込み中...'
                      : user?.data?.name || 'ゲスト'}
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
