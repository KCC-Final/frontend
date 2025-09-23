import { API_BASE, DATA4LIBRARY_KEY } from './config';

// 책 검색 API
export async function searchBooks(keyword: string, pageNo: number = 1, pageSize: number = 10) {
  const url = `${API_BASE}/api/data4library/srchBooks?authKey=${DATA4LIBRARY_KEY}&keyword=${encodeURIComponent(
    keyword
  )}&pageNo=${pageNo}&pageSize=${pageSize}&format=json`; // ✅ format=json 추가

  const res = await fetch(url);
  if (!res.ok) throw new Error('정보나루 검색 API 호출 실패');
  return await res.json();
}

// 인기대출도서 조회 API
export async function getPopularBooks(
  startDt: string,
  endDt: string,
  pageNo: number = 1,
  pageSize: number = 10
) {
  const url = `${API_BASE}/api/data4library/loanItemSrch?authKey=${DATA4LIBRARY_KEY}&startDt=${startDt}&endDt=${endDt}&pageNo=${pageNo}&pageSize=${pageSize}&format=json`; // ✅ format=json 추가

  const res = await fetch(url);
  if (!res.ok) throw new Error('정보나루 인기대출도서 API 호출 실패');
  return await res.json();
}

// 도서 상세 조회 API
export async function getBookDetail(
  isbn13: string,
  loaninfoYN: string = 'Y',
  displayInfo: string = 'age'
) {
  const url = `${API_BASE}/api/data4library/srchDtlList?authKey=${DATA4LIBRARY_KEY}&isbn13=${isbn13}&loaninfoYN=${loaninfoYN}&displayInfo=${displayInfo}&format=json`;

  const res = await fetch(url);
  if (!res.ok) throw new Error('정보나루 도서상세 API 호출 실패');
  return await res.json();
}

// 정보공개 도서관 조회 API
export async function getLibraries(pageNo: number = 1, pageSize: number = 10, region?: string) {
  let url = `${API_BASE}/api/data4library/libSrch?authKey=${DATA4LIBRARY_KEY}&pageNo=${pageNo}&pageSize=${pageSize}&format=json`;

  if (region) {
    url += `&region=${region}`;
  }

  const res = await fetch(url);
  if (!res.ok) throw new Error('정보나루 도서관조회 API 호출 실패');
  return await res.json();
}

// 대출 급상승 도서 API
export async function getHotTrendBooks(searchDt: string) {
  const url = `${API_BASE}/api/data4library/hotTrend?authKey=${DATA4LIBRARY_KEY}&searchDt=${searchDt}&format=json`;

  const res = await fetch(url);
  if (!res.ok) throw new Error('정보나루 급상승도서 API 호출 실패');
  return await res.json();
}

// 도서관별 장서/대출 데이터 조회 API
export async function getLibraryItems(
  libCode: string,
  type: string = 'ALL',
  pageNo: number = 1,
  pageSize: number = 10
) {
  const url = `${API_BASE}/api/data4library/itemSrch?authKey=${DATA4LIBRARY_KEY}&libCode=${libCode}&type=${type}&pageNo=${pageNo}&pageSize=${pageSize}&format=json`;

  const res = await fetch(url);
  if (!res.ok) throw new Error('정보나루 도서관별장서 API 호출 실패');
  return await res.json();
}

// 마니아를 위한 추천도서 API
export async function getManiaRecommendBooks(isbn13: string) {
  const url = `${API_BASE}/api/data4library/recommandList?authKey=${DATA4LIBRARY_KEY}&isbn13=${isbn13}&format=json`;

  const res = await fetch(url);
  if (!res.ok) throw new Error('정보나루 마니아추천 API 호출 실패');
  return await res.json();
}

// 다독자를 위한 추천도서 API
export async function getReaderRecommendBooks(isbn13: string) {
  const url = `${API_BASE}/api/data4library/recommandList?authKey=${DATA4LIBRARY_KEY}&type=reader&isbn13=${isbn13}&format=json`;

  const res = await fetch(url);
  if (!res.ok) throw new Error('정보나루 다독자추천 API 호출 실패');
  return await res.json();
}

// 도서 소장 도서관 조회 API
export async function getLibrariesByBook(
  isbn: string,
  region: string,
  pageNo: number = 1,
  pageSize: number = 10
) {
  const url = `${API_BASE}/api/data4library/libSrchByBook?authKey=${DATA4LIBRARY_KEY}&isbn=${isbn}&region=${region}&pageNo=${pageNo}&pageSize=${pageSize}&format=json`;

  const res = await fetch(url);
  if (!res.ok) throw new Error('정보나루 소장도서관 API 호출 실패');
  return await res.json();
}

// 도서관별 도서 소장여부 및 대출 가능여부 조회 API
export async function checkBookAvailability(libCode: string, isbn13: string) {
  const url = `${API_BASE}/api/data4library/bookExist?authKey=${DATA4LIBRARY_KEY}&libCode=${libCode}&isbn13=${isbn13}&format=json`;

  const res = await fetch(url);
  if (!res.ok) throw new Error('정보나루 도서소장여부 API 호출 실패');
  return await res.json();
}

// 도서관별 대출반납추이 API
export async function getLibraryUsageTrend(libCode: string, type: string = 'D') {
  const url = `${API_BASE}/api/data4library/usageTrend?authKey=${DATA4LIBRARY_KEY}&libCode=${libCode}&type=${type}&format=json`;

  const res = await fetch(url);
  if (!res.ok) throw new Error('정보나루 대출반납추이 API 호출 실패');
  return await res.json();
}

// 도서별 키워드 목록 API
export async function getBookKeywords(isbn13: string, additionalYN: string = 'Y') {
  const url = `${API_BASE}/api/data4library/keywordList?authKey=${DATA4LIBRARY_KEY}&isbn13=${isbn13}&additionalYN=${additionalYN}&format=json`;

  const res = await fetch(url);
  if (!res.ok) throw new Error('정보나루 도서키워드 API 호출 실패');
  return await res.json();
}

// 도서별 이용 분석 API
export async function getBookUsageAnalysis(isbn13: string) {
  const url = `${API_BASE}/api/data4library/usageAnalysisList?authKey=${DATA4LIBRARY_KEY}&isbn13=${isbn13}&format=json`;

  const res = await fetch(url);
  if (!res.ok) throw new Error('정보나루 도서이용분석 API 호출 실패');
  return await res.json();
}

// 도서관별 통합정보 API
export async function getLibraryIntegratedInfo(
  pageNo: number = 1,
  pageSize: number = 10,
  region?: string
) {
  let url = `${API_BASE}/api/data4library/extends/libSrch?authKey=${DATA4LIBRARY_KEY}&pageNo=${pageNo}&pageSize=${pageSize}&format=json`;

  if (region) {
    url += `&region=${region}`;
  }

  const res = await fetch(url);
  if (!res.ok) throw new Error('정보나루 도서관통합정보 API 호출 실패');
  return await res.json();
}

// 이달의 키워드 API
export async function getMonthlyKeywords(month?: string) {
  let url = `${API_BASE}/api/data4library/monthlyKeywords?authKey=${DATA4LIBRARY_KEY}&format=json`;

  if (month) {
    url += `&month=${month}`;
  }

  const res = await fetch(url);
  if (!res.ok) throw new Error('정보나루 이달의키워드 API 호출 실패');
  return await res.json();
}

// 지역별 독서량/독서율 API
export async function getRegionalReadingStats(region?: string, year?: string, month?: string) {
  let url = `${API_BASE}/api/data4library/readQt?authKey=${DATA4LIBRARY_KEY}&format=json`;

  if (region) url += `&region=${region}`;
  if (year) url += `&year=${year}`;
  if (month) url += `&month=${month}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error('정보나루 지역별독서통계 API 호출 실패');
  return await res.json();
}

// 신착도서 조회 API
export async function getNewArrivalBooks(libCode: string, searchDt?: string) {
  let url = `${API_BASE}/api/data4library/newArrivalBook?authKey=${DATA4LIBRARY_KEY}&libCode=${libCode}&format=json`;

  if (searchDt) {
    url += `&searchDt=${searchDt}`;
  }

  const res = await fetch(url);
  if (!res.ok) throw new Error('정보나루 신착도서 API 호출 실패');
  return await res.json();
}
