import { NextResponse } from 'next/server';

import { fetchGrooInServer } from '@/apis';
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

  // 접속한 페이지 url
  const { pathname } = request.nextUrl;
  devLogger(`\n\n[Front MiddleWare] Path: ${pathname}`);

  // 리다이렉트할 페이지 url
  const loginUrl = new URL('/login', request.url);
  const homeUrl = new URL('/', request.url);

  // 현재 경로가 로그인하지 않은 사용자를 위한 페이지인 경우 (로그인, 회원가입, ID/PW찾기)
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup');
  if (isAuthPage) {
    if (accessToken) {
      devLogger(`[Front MiddleWare] 토큰 보유중인 사용자의 접속 시도: ${pathname}`);
      devLogger('[Front MiddleWare] 메인페이지로 리다이렉트');
      return NextResponse.redirect(homeUrl);
    }
    // 토큰이 없으면 페이지 진입 허용
    devLogger(`[Front MiddleWare] 토큰 없는 사용자의 접속 시도: ${pathname}\n`);
    return NextResponse.next();
  }

  // accessToken이 있는 경우 통과
  if (accessToken) {
    devLogger(`토큰 보유중인 유저 접속 시도: ${pathname}}\n`);
    return NextResponse.next();
  }

  // accessToken이 없거나 유효하지 않으며, refreshToken은 있는 경우
  if (refreshToken) {
    try {
      const reissueResponse = await fetchGrooInServer.auth.reissueToken(refreshToken);
      const setCookieHeader = reissueResponse.headers['set-cookie'];

      if (!setCookieHeader) {
        throw new Error("토큰 재발행 응답에 'Set-Cookie' 헤더가 없습니다.");
      }

      devLogger('[Front MiddleWare] 토큰 재발행 성공. 기존 요청 재시도');
      const response = NextResponse.redirect(request.url);

      const cookieToSet = Array.isArray(setCookieHeader) ? setCookieHeader[0] : setCookieHeader;
      response.headers.set('Set-Cookie', cookieToSet);

      return response;
    } catch (error) {
      devLogger('[Front MiddleWare] 토큰 재발행 실패. 로그인 페이지로 리다이렉트', true);
      devLogger(error, true);

      // 기존에 있던 만료된 refreshToken 삭제 후 리다이렉트
      const responseRedirect = NextResponse.redirect(loginUrl);
      responseRedirect.cookies.delete('accessToken');
      responseRedirect.cookies.delete('refreshToken');
      return responseRedirect;
    }
  }

  // 모든 토큰이 없는 경우
  devLogger(`[Front MiddleWare] 토큰이 없는 사용자의 접속 시도: ${pathname}`);
  return NextResponse.redirect(loginUrl);
}
