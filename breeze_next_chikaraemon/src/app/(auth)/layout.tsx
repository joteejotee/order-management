import AuthCard from '@/app/(auth)/AuthCard';

export const metadata = {
  title: 'Laravel',
};

import { ReactNode } from 'react';

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <div className="font-sans text-gray-900 antialiased">
        <AuthCard>{children}</AuthCard>
      </div>
    </div>
  );
};

export default Layout;
