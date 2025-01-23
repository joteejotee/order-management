'use client';

import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const AppLayout = ({ children }: Props) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <main>{children}</main>
    </div>
  );
};

export default AppLayout;
