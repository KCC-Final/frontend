import { Noto_Sans_KR } from 'next/font/google';

import type { Metadata } from 'next';

import '@/styles/globals.scss';

const notoSansKr = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700']
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
    <html lang="ko">
      <body className={notoSansKr.className}>{children}</body>
    </html>
  );
}

export default RootLayout;
