import { Noto_Sans_KR, Noto_Serif_KR } from 'next/font/google';
import localFont from 'next/font/local';

import type { Metadata } from 'next';

import '@/styles/tailwind.css';
import '@/styles/globals.scss';

const notoSansKr = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-noto-sans-kr'
});

const notoSerifKr = Noto_Serif_KR({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-noto-serif-kr'
});

const seoulNotice = localFont({
  src: [
    {
      path: './SeoulAlrimTTF-Heavy.woff2',
      weight: '900'
    }
  ],
  variable: '--font-seoul-notice'
});

export const metadata: Metadata = {
  title: '그루',
  description: '일상을 심다, 독서 경험의 모든 것. 독서 SNS 그루'
};

interface RootLayoutProps {
  children: React.ReactNode;
}

function RootLayout({ children }: Readonly<RootLayoutProps>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={notoSansKr.className} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

export default RootLayout;
