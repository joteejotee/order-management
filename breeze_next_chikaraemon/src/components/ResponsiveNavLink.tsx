import Link from 'next/link';
import { ReactNode } from 'react';

interface ResponsiveNavLinkProps {
  href: string;
  active?: boolean;
  children: ReactNode;
  className?: string;
}

interface ResponsiveNavButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

const ResponsiveNavLink = ({
  href,
  active = false,
  children,
  className = '',
}: ResponsiveNavLinkProps) => (
  <Link
    href={href}
    className={`w-full flex items-start pl-3 pr-4 py-2 border-l-4 ${
      active
        ? 'border-indigo-400 text-indigo-700 bg-indigo-50 focus:text-indigo-800 focus:bg-indigo-100 focus:border-indigo-700'
        : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300'
    } text-base font-medium focus:outline-none transition ${className}`}
  >
    {children}
  </Link>
);

export const ResponsiveNavButton = (props: ResponsiveNavButtonProps) => (
  <button className="w-full flex items-center px-4 py-2 text-sm" {...props}>
    {props.children}
  </button>
);

export default ResponsiveNavLink;
