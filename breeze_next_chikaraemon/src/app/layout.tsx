'use client';

import './globals.css';
import { ReactNode } from 'react';
import { Inter, Noto_Sans_JP } from 'next/font/google';

interface RootLayoutProps {
  children: ReactNode;
}

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  variable: '--font-noto-sans-jp',
});

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ja" className={`${inter.variable} ${notoSansJP.variable}`}>
      <body className="antialiased text-lg">{children}</body>
    </html>
  );
}
