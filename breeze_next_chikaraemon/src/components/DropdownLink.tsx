import Link from 'next/link';
import { Menu } from '@headlessui/react';

// 型定義を追加
interface DropdownLinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  href: string;
  children: React.ReactNode;
  onClick?: () => Promise<void> | void;
}

const DropdownLink = ({
  href,
  children,
  className = '',
  onClick,
  ...props
}: DropdownLinkProps) => (
  <Menu.Item>
    {({ close }) => (
      <Link
        href={href}
        className={`block px-4 py-2 text-sm ${className}`}
        onClick={() => {
          if (onClick) {
            onClick();
          }
          close();
        }}
        {...props}
      >
        {children}
      </Link>
    )}
  </Menu.Item>
);

interface DropdownButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const DropdownButton = ({ children, ...props }: DropdownButtonProps) => (
  <Menu.Item>
    {({ active }) => (
      <button
        className={`w-full text-left block px-4 py-2 text-base leading-5 text-gray-700 ${
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
