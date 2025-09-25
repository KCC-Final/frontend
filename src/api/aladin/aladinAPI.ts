import { ALADIN_PROXY_CONFIG } from './config';

// 1. 검색
export async function searchBooks(query: string) {
  const res = await fetch(`${ALADIN_PROXY_CONFIG.BASE_URL}/search?query=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error('백엔드 검색 API 호출 실패');
  return await res.json();
}

// 2. 상세 조회
export async function getBookDetail(isbn: string) {
  const res = await fetch(`${ALADIN_PROXY_CONFIG.BASE_URL}/detail?isbn13=${isbn}`);
  if (!res.ok) throw new Error('백엔드 상세 API 호출 실패');
  return await res.json();
}

// 3. 베스트셀러
export async function getBestsellers(maxResults: number = 10) {
  const res = await fetch(`${ALADIN_PROXY_CONFIG.BASE_URL}/bestseller?maxResults=${maxResults}`);
  if (!res.ok) throw new Error('백엔드 베스트셀러 API 호출 실패');
  return await res.json();
}
