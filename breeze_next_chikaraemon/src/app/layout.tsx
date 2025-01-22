import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Laravel',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // wheelイベントのパッシブリスナーを有効化
              document.addEventListener('wheel', function() {}, { passive: true });
            `,
          }}
        />
      </head>
      <body className={`antialiased ${inter.className}`}>{children}</body>
    </html>
  );
}
