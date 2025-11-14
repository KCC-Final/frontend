import { Metadata } from 'next';
import { Noto_Serif_KR } from 'next/font/google';
import localFont from 'next/font/local';
import { cookies } from 'next/headers';

import { fetchGrooInServer } from '@/apis';
import NotificationSubscriber from '@/components/setup/notification-subscriber';
import StoreInitializer from '@/components/setup/store-initializer';
import { Token, User } from '@/types';
import { getTokenInCookie } from '@/utils/cookie';
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

async function getMyInfo(token: Token): Promise<User | null> {
  if (!token.accessToken) return null; // 토큰 없으면 요청 안 함
  try {
    const myInfo = await fetchGrooInServer.user.getMyInfo(token);
    return myInfo.data;
  } catch (error) {
    devLogger('getMyInfo 실패', true);
    return null;
  }
}

async function RootLayout({ children }: Readonly<RootLayoutProps>) {
  const cookieStore = await cookies();
  const token = getTokenInCookie(cookieStore);

  const myInfo = await getMyInfo(token);

  return (
    <html lang="ko">
      <body className={`${pretendard.variable} ${notoSerifKr.variable} ${seoulNotice.variable}`}>
        <StoreInitializer user={myInfo} />
        <NotificationSubscriber user={myInfo} /> {/* 로그인한 사용자만 알림 구독 */}
        {children}
      </body>
    </html>
  );
}

export default RootLayout;
