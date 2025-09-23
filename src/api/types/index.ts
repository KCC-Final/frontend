// 📁 src/api/types/index.ts

// 공통 API 응답 타입
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  totalCount?: number;
  pageInfo?: {
    pageNo: number;
    pageSize: number;
    totalPages: number;
  };
}

// 알라딘 API 타입들
export * from './aladin';
