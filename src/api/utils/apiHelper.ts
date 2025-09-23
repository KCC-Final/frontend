// 📁 src/api/utils/apiHelper.ts
import type { ApiResponse } from '../types/index';

/**
 * API 응답 래퍼 함수
 */
export const createApiResponse = <T>(
  success: boolean,
  data?: T,
  error?: string,
  message?: string
): ApiResponse<T> => ({
  success,
  data,
  error,
  message
});

/**
 * 에러 메시지 정규화
 */
export const normalizeErrorMessage = (error: any): string => {
  if (typeof error === 'string') return error;
  if (error?.message) return error.message;
  if (error?.response?.data?.message) return error.response.data.message;
  return '알 수 없는 오류가 발생했습니다.';
};

/**
 * ISBN 유효성 검사
 */
export const validateISBN = (isbn: string): boolean => {
  const cleaned = isbn.replace(/[-\s]/g, '');
  return /^(97[89])?[\d]{9}[\dX]$/.test(cleaned);
};

/**
 * 날짜 포맷팅 (YYYY-MM-DD)
 */
export const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

/**
 * 쿼리 파라미터 정리 (undefined/null 제거)
 */
export const cleanParams = (params: Record<string, any>): Record<string, any> => {
  const cleaned: Record<string, any> = {};

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      cleaned[key] = value;
    }
  });

  return cleaned;
};

/**
 * 배열을 청크 단위로 분할
 */
export const chunkArray = <T>(array: T[], chunkSize: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
};

/**
 * 디바운스 함수
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * 재시도 로직 포함 API 호출
 */
export const retryApiCall = async <T>(
  apiCall: () => Promise<ApiResponse<T>>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<ApiResponse<T>> => {
  let lastError: any;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await apiCall();
      if (result.success) {
        return result;
      }
      lastError = result.error;
    } catch (error) {
      lastError = error;
    }

    if (attempt < maxRetries) {
      await new Promise((resolve) => setTimeout(resolve, delay * attempt));
    }
  }

  return {
    success: false,
    error: `${maxRetries}번 시도 후 실패: ${normalizeErrorMessage(lastError)}`
  };
};

/**
 * 병렬 API 호출 관리
 */
export const parallelApiCalls = async <T>(
  apiCalls: (() => Promise<ApiResponse<T>>)[],
  maxConcurrency: number = 3
): Promise<ApiResponse<T>[]> => {
  const results: ApiResponse<T>[] = [];
  const chunks = chunkArray(apiCalls, maxConcurrency);

  for (const chunk of chunks) {
    const chunkResults = await Promise.allSettled(chunk.map((call) => call()));

    results.push(
      ...chunkResults.map((result) =>
        result.status === 'fulfilled' ? result.value : { success: false, error: result.reason }
      )
    );
  }

  return results;
};
