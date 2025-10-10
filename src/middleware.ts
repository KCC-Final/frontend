import { NextResponse } from 'next/server';

import { fetchGroo } from '@/apis';
import { devLogger } from '@/utils/dev-logger';

import type { NextRequest } from 'next/server';

export const config = {
  // 아래 경로 외 모든 경로에서 미들웨어를 실행
  // api, _next/static, _next/image, favicon.ico, chrome devtools 제외
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.well-known).*)']
};

export async function middleware(request: NextRequest) {
  // 쿠키에 저장된 토큰값 불러오기
  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  // 리다이렉트할 페이지 url
  const loginUrl = new URL('/login', request.url);
  const homeUrl = new URL('/', request.url);

  // 현재 경로가 로그인하지 않은 사용자를 위한 페이지인 경우 (로그인, 회원가입, ID/PW찾기)
  const { pathname } = request.nextUrl;
  devLogger(`[Front MiddleWare] 접속 url: ${pathname}`);
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup');
  if (isAuthPage) {
    if (accessToken) {
      return NextResponse.redirect(homeUrl);
    }
    return NextResponse.next();
  }

  // accessToken이 있는 경우 통과
  if (accessToken) {
    return NextResponse.next();
  }

  // accessToken과 refreshToken 모두 없는 경우 로그인 페이지로 리디렉션
  if (!refreshToken) {
    return NextResponse.redirect(loginUrl);
  }

  // accessToken은 없고 refreshToken만 있는 경우
  try {
    // accessToken 재발행 시도
    const reissueResponse = await fetchGroo.auth.reissueTokenInServer(refreshToken);

    // 재발행 성공시 'set-cookie' 값을 브라우저로 전달
    const response = NextResponse.next();
    const setCookieHeader = reissueResponse.headers['set-cookie'];
    if (setCookieHeader) {
      const cookieToSet = Array.isArray(setCookieHeader) ? setCookieHeader[0] : setCookieHeader;
      response.headers.set('Set-Cookie', cookieToSet);
    }

    return response;
  } catch (error) {
    devLogger('Middleware token reissue error');
    devLogger(error);

    // 기존에 있던 만료된 refreshToken 삭제 후 리다이렉트
    const responseRedirect = NextResponse.redirect(loginUrl);
    responseRedirect.cookies.delete('refreshToken');
    return responseRedirect;
  }
}
