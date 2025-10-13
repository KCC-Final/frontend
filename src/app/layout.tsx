import { Metadata } from 'next';
import { Noto_Serif_KR } from 'next/font/google';
import localFont from 'next/font/local';
import { cookies } from 'next/headers';

import { fetchGroo } from '@/apis';
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

/**
 * 서버 컴포넌트에서 사용자 정보를 가져오는 함수.
 * HttpOnly 쿠키는 서버 fetch 요청에 자동으로 포함됩니다.
 */
async function getMyInfo(): Promise<User | null> {
  // 서버 컴포넌트에서 쿠키를 가져옵니다.
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  // accessToken이 없으면 API를 호출하지 않고 null을 반환합니다.
  if (!accessToken && !refreshToken) {
    return null;
  }

  try {
    const response = await fetchGroo.user.getMyInfoInServer({
      accessToken: accessToken as string,
      refreshToken: refreshToken as string
    });
    return response.data;
  } catch (error) {
    devLogger('내 정보 조회에 실패했습니다.', true);
    devLogger(error, true);
    return null;
  }
}

async function RootLayout({ children }: Readonly<RootLayoutProps>) {
  const myInfo = await getMyInfo();

  return (
    <html lang="ko">
      <body className={`${pretendard.variable} ${notoSerifKr.variable} ${seoulNotice.variable}`}>
        <StoreInitializer user={myInfo} />
        {children}
      </body>
    </html>
  );
}

export default RootLayout;
