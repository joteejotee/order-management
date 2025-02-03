'use client';

import Navigation from '@/components/Layouts/Navigation';
import { ReactNode } from 'react';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <main>{children}</main>
    </div>
  );
}
