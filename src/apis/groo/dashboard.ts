import {
  DashboardSummaryResponse,
  MonthlyStatsResponse,
  MonthlyReportResponse,
  YearlyStatsResponse
} from '@/types/dashboard/dashboard';
import { getDashboardErrorMessage } from '@/utils/error/dashboard-error-handler';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

/**
 * API 에러 처리 헬퍼
 * @param response - fetch response
 * @throws 에러 객체
 */
const handleApiResponse = async (response: Response) => {
  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = { message: 'Unknown error' };
    }

    const error = {
      response: {
        status: response.status,
        data: errorData
      },
      message: errorData.message || `HTTP error! status: ${response.status}`
    };
    throw error;
  }

  return response.json();
};

export const getSummaryStats = async (): Promise<DashboardSummaryResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/dashboard/summary`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      },
      credentials: 'include'
    });

    const data = await handleApiResponse(response);
    return data.data;
  } catch (error) {
    console.error('대시보드 통계 조회 실패:', error);
    const errorMessage = getDashboardErrorMessage(error);
    throw new Error(errorMessage);
  }
};

export const getMonthlyStats = async (year?: number): Promise<MonthlyStatsResponse> => {
  try {
    const currentYear = year || new Date().getFullYear();

    // 연도 유효성 검증
    if (currentYear < 1900 || currentYear > 2100) {
      throw {
        response: {
          status: 400,
          data: { errorCode: 'DSH-004' }
        }
      };
    }

    const response = await fetch(`${API_BASE_URL}/api/v1/dashboard/monthly?year=${currentYear}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      },
      credentials: 'include'
    });

    const data = await handleApiResponse(response);
    return data.data;
  } catch (error) {
    console.error('월별 통계 조회 실패:', error);
    const errorMessage = getDashboardErrorMessage(error);
    throw new Error(errorMessage);
  }
};

export const getMonthlyReport = async (year?: number, month?: number): Promise<MonthlyReportResponse> => {
  try {
    const now = new Date();
    const targetYear = year || now.getFullYear();
    const targetMonth = month || now.getMonth() + 1;

    // 연도 유효성 검증
    if (targetYear < 1900 || targetYear > 2100) {
      throw {
        response: {
          status: 400,
          data: { errorCode: 'DSH-004' }
        }
      };
    }

    // 월 유효성 검증
    if (targetMonth < 1 || targetMonth > 12) {
      throw {
        response: {
          status: 400,
          data: { errorCode: 'DSH-002' }
        }
      };
    }

    const params = new URLSearchParams();
    params.append('year', targetYear.toString());
    params.append('month', targetMonth.toString());

    const response = await fetch(`${API_BASE_URL}/api/v1/dashboard/monthly-report?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      },
      credentials: 'include'
    });

    const data = await handleApiResponse(response);
    return data.data;
  } catch (error) {
    console.error('월간 리포트 조회 실패:', error);
    const errorMessage = getDashboardErrorMessage(error);
    throw new Error(errorMessage);
  }
};

export const getYearlyStats = async (): Promise<YearlyStatsResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/dashboard/yearly`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      },
      credentials: 'include'
    });

    const data = await handleApiResponse(response);
    return data.data;
  } catch (error) {
    console.error('연도별 통계 조회 실패:', error);
    const errorMessage = getDashboardErrorMessage(error);
    throw new Error(errorMessage);
  }
};
