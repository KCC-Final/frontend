import { Metadata } from 'next';
import { Noto_Serif_KR } from 'next/font/google';
import localFont from 'next/font/local';
import { headers } from 'next/headers';

import NotificationSubscriber from '@/components/setup/notification-subscriber';
import StoreInitializer from '@/components/setup/store-initializer';
import { User } from '@/types';
import { devLogger } from '@/utils/dev-logger';

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
  weight: ['500', '700'],
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

async function RootLayout({ children }: Readonly<RootLayoutProps>) {
  const headersList = await headers();
  const userInfoHeader = headersList.get('x-user-info');

  let myInfo: User | null = null;
  if (userInfoHeader) {
    try {
      const decodedUserInfo = Buffer.from(userInfoHeader, 'base64').toString('utf-8');
      myInfo = JSON.parse(decodedUserInfo);
    } catch (error) {
      devLogger('내 정보 디코딩 또는 파싱에 실패했습니다.', true);
      devLogger(error, true);
    }
  }

  return (
    <html lang="ko">
      <body className={`${pretendard.variable} ${notoSerifKr.variable} ${seoulNotice.variable}`}>
        <StoreInitializer user={myInfo} />
        <NotificationSubscriber /> {/* 앱 전역에서 알림 구독 */}
        {children}
      </body>
    </html>
  );
}

export default RootLayout;
