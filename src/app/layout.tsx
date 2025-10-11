import { Noto_Serif_KR } from 'next/font/google';
import localFont from 'next/font/local';

import type { Metadata } from 'next';

import '@/styles/tailwind.css';
import '@/styles/globals.scss';

const pretendard = localFont({
  src: [
    {
      path: '../../public/fonts/Pretendard-Regular.woff2',
      weight: '400'
    },
    {
      path: '../../public/fonts/Pretendard-Medium.woff2',
      weight: '500'
    },
    {
      path: '../../public/fonts/Pretendard-SemiBold.woff2',
      weight: '600'
    },
    {
      path: '../../public/fonts/Pretendard-Bold.woff2',
      weight: '700'
    }
  ],
  variable: '--font-pretendard',
  display: 'swap'
});

const notoSerifKr = Noto_Serif_KR({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-noto-serif-kr'
});

const seoulNotice = localFont({
  src: [
    {
      path: '../../public/fonts/SeoulAlrimTTF-Heavy.woff2',
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
    <html lang="ko">
      <body className={`${pretendard.variable} ${notoSerifKr.variable} ${seoulNotice.variable}`}>
        {children}
      </body>
    </html>
  );
}

export default RootLayout;
