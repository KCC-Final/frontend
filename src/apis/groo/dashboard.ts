import axiosGroo from '@/apis/groo/config';
import {
  DashboardSummaryResponse,
  MonthlyStatsResponse,
  MonthlyReportResponse,
  YearlyStatsResponse
} from '@/types/dashboard/dashboard';

export const dashboard = {
  // 대시보드 요약 통계 조회
  getSummaryStats: async (): Promise<DashboardSummaryResponse> => {
    const response = await axiosGroo.get<{ data: DashboardSummaryResponse }>('/dashboard/summary');
    return response.data.data;
  },

  // 월별 통계 조회
  getMonthlyStats: async (year?: number): Promise<MonthlyStatsResponse> => {
    const currentYear = year || new Date().getFullYear();

    // 연도 유효성 검증
    if (currentYear < 1900 || currentYear > 2100) {
      throw new Error('유효하지 않은 연도입니다.');
    }

    const response = await axiosGroo.get<{ data: MonthlyStatsResponse }>('/dashboard/monthly', {
      params: { year: currentYear }
    });
    return response.data.data;
  },

  // 월간 리포트 조회
  getMonthlyReport: async (year?: number, month?: number): Promise<MonthlyReportResponse> => {
    const now = new Date();
    const targetYear = year || now.getFullYear();
    const targetMonth = month || now.getMonth() + 1;

    // 유효성 검증
    if (targetYear < 1900 || targetYear > 2100) {
      throw new Error('유효하지 않은 연도입니다.');
    }

    if (targetMonth < 1 || targetMonth > 12) {
      throw new Error('유효하지 않은 월입니다.');
    }

    const response = await axiosGroo.get<{ data: MonthlyReportResponse }>('/dashboard/monthly-report', {
      params: {
        year: targetYear,
        month: targetMonth
      }
    });
    return response.data.data;
  },

  // 연도별 통계 조회
  getYearlyStats: async (): Promise<YearlyStatsResponse> => {
    const response = await axiosGroo.get<{ data: YearlyStatsResponse }>('/dashboard/yearly');
    return response.data.data;
  }
};
