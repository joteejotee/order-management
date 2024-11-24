import Link from 'next/link';
import { Menu } from '@headlessui/react';

// 型定義を追加
interface DropdownLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

const DropdownLink = ({
  href,
  children,
  className = '',
}: DropdownLinkProps) => (
  <Link href={href} className={`block px-4 py-2 text-sm ${className}`}>
    {children}
  </Link>
);

interface DropdownButtonProps {
  children: React.ReactNode;
  [key: string]: any; // 他のpropsを許容
}

export const DropdownButton = ({ children, ...props }: DropdownButtonProps) => (
  <Menu.Item>
    {({ active }) => (
      <button
        className={`w-full text-left block px-4 py-2 text-sm leading-5 text-gray-700 ${
          active ? 'bg-gray-100' : ''
        } focus:outline-none transition duration-150 ease-in-out`}
        {...props}
      >
        {children}
      </button>
    )}
  </Menu.Item>
);

export default DropdownLink;
