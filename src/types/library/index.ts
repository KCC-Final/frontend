import axios from 'axios';

import { LoanItemsResponse } from './dto';

/** 기존 axios 기반 함수들 (그대로 유지) */
export const fetchLibrary = {
  // 예: 기존에 있던 함수들
  searchBooks: (keyword: string, pageNo = 1, pageSize = 10) =>
    axios.get(`/data4library/search`, { params: { keyword, pageNo, pageSize } }),

  getPopularBooks: (startDt: string, endDt: string, pageNo = 1, pageSize = 10) =>
    axios.get(`/data4library/loanItemSrch`, {
      params: { startDt, endDt, pageNo, pageSize }
    })

  // ...여기 기존 함수들 그대로 유지...
} as const;

const DATA4LIB_BASE = 'https://data4library.kr/api';
const AUTH_KEY = process.env.NEXT_PUBLIC_DATA4LIBRARY_KEY ?? process.env.DATA4LIBRARY_KEY ?? '';

function ensurePeriod(startDt?: string, endDt?: string) {
  if (startDt && endDt) return { startDt, endDt };
  const end = new Date();
  const start = new Date();
  start.setMonth(end.getMonth() - 3);
  return {
    startDt: startDt ?? start.toISOString().slice(0, 10),
    endDt: endDt ?? end.toISOString().slice(0, 10)
  };
}

async function get<T>(path: string, params: Record<string, any>): Promise<T> {
  const usp = new URLSearchParams({ authKey: AUTH_KEY, format: 'json' });
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === '') return;
    usp.set(k, String(v));
  });
  const url = `${DATA4LIB_BASE}/${path}?${usp.toString()}`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`[Data4Library:${path}] ${res.status} ${res.statusText}`);
  return (await res.json()) as T;
}

/** 전국 인기대출 (성별/연령 포함) */
export async function getLoanItemsAll(params: {
  startDt?: string;
  endDt?: string;
  gender?: string; // 0|1|2
  age?: string; // 0/6/8/14/20/30/40/50/60/-1
  pageNo?: number;
  pageSize?: number;
}): Promise<LoanItemsResponse> {
  const { startDt, endDt } = ensurePeriod(params.startDt, params.endDt);
  return get<LoanItemsResponse>('loanItemSrch', {
    startDt,
    endDt,
    gender: params.gender,
    age: params.age,
    pageNo: params.pageNo ?? 1,
    pageSize: params.pageSize ?? 200
  });
}

/** 지역 인기대출 (성별/연령 포함) */
export async function getLoanItemsByRegion(params: {
  region: string | string[]; // 세미콜론 다중 허용
  dtl_region?: string | string[];
  startDt?: string;
  endDt?: string;
  gender?: string;
  age?: string;
  pageNo?: number;
  pageSize?: number;
}): Promise<LoanItemsResponse> {
  const { startDt, endDt } = ensurePeriod(params.startDt, params.endDt);
  const region = Array.isArray(params.region) ? params.region.join(';') : params.region;
  const dtl_region = Array.isArray(params.dtl_region) ? params.dtl_region.join(';') : params.dtl_region;

  return get<LoanItemsResponse>('loanItemSrch', {
    startDt,
    endDt,
    region,
    dtl_region,
    gender: params.gender,
    age: params.age,
    pageNo: params.pageNo ?? 1,
    pageSize: params.pageSize ?? 200
  });
}
