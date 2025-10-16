import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

import { Token } from '@/types';

/** 쿠키에서 헤더를 가져오는 함수 */
export const getTokenInCookie = (cookieStore: ReadonlyRequestCookies): Token => {
  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  return { accessToken: accessToken ? accessToken : '', refreshToken: refreshToken ? refreshToken : '' };
};

/** nextjs서버에서 백엔드로 요청시 헤더의 쿠키에 토큰을 설정하는 함수 */
export const setTokenInHeader = (accessToken: string, refreshToken: string) => {
  if (accessToken && refreshToken)
    return { Cookie: `accessToken=${accessToken}; refreshToken=${refreshToken}` };
  if (accessToken) return { Cookie: `accessToken=${accessToken}` };
  if (refreshToken) return { Cookie: `refreshToken=${refreshToken}` };
  return { Cookie: '' };
};
