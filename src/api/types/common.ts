// 📁 src/api/types/common.ts
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  pageNo: number;
  pageSize: number;
}

export interface ApiConfig {
  baseURL: string;
  apiKey: string;
  timeout?: number;
}

export interface DateRange {
  startDt?: string;
  endDt?: string;
}
