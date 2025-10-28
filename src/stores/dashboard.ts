import { create } from 'zustand';

import { fetchGroo } from '@/apis';
import { DashboardAllData } from '@/types/dashboard';
import { devLogger } from '@/utils/dev-logger';

interface DashboardState {
  dashboardData: DashboardAllData;
  loading: boolean;
  error: string | null;
  periodChartType: 'monthly' | 'yearly';
  periodChartYear: number;
  reportYear: number;
  reportMonth: number;
}

interface DashboardActions {
  fetchAllDashboardData: () => Promise<void>;
  changePeriodChartType: (type: 'monthly' | 'yearly') => () => void;
  changePeriodChartYear: (event: React.ChangeEvent<HTMLSelectElement>) => Promise<void>;
  changeReportYear: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  changeReportMonth: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  changeReportData: () => Promise<void>;
  resetReportDate: () => void;
}

export const useDashboardStore = create<DashboardState & DashboardActions>((set, get) => ({
  dashboardData: {
    followers: [],
    followings: [],
    totalReviews: 0,
    totalScrappedBooks: 0,
    totalLikedReviews: 0,
    monthlyStats: [],
    yearlyStats: [],
    categoryStats: [],
    reportInfo: { myAverage: 0, totalAverage: 0, year: 0, month: 0 }
  },
  loading: true,
  error: null,
  periodChartType: 'monthly',
  periodChartYear: new Date().getFullYear(),
  reportYear: new Date().getFullYear(),
  reportMonth: new Date().getMonth() + 1,

  fetchAllDashboardData: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetchGroo.dashboard.getAllDashboardData();
      set({ dashboardData: response.data, loading: false });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch data', loading: false });
    }
  },

  changePeriodChartType: (type: 'monthly' | 'yearly') => () => {
    set({ periodChartType: type });
  },

  changePeriodChartYear: async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const year = Number(event.target.value);
    set({ periodChartYear: year });
    try {
      const newMonthly = await fetchGroo.dashboard.getMonthlyStats(year);
      set({ dashboardData: { ...get().dashboardData, monthlyStats: newMonthly.monthlyStats } });
    } catch (error) {
      devLogger(error, true);
    }
  },

  changeReportYear: (event: React.ChangeEvent<HTMLSelectElement>) => {
    set({ reportYear: Number(event.target.value) });
  },

  changeReportMonth: (event: React.ChangeEvent<HTMLSelectElement>) => {
    set({ reportMonth: Number(event.target.value) });
  },

  changeReportData: async () => {
    const { reportYear: year, reportMonth: month } = get();
    try {
      const newReport = await fetchGroo.dashboard.getMonthlyReport(year, month);
      set({
        dashboardData: {
          ...get().dashboardData,
          reportInfo: {
            myAverage: newReport.myCount,
            totalAverage: newReport.averageCount,
            year,
            month
          }
        }
      });
    } catch (error) {
      devLogger(error, true);
    }
  },

  resetReportDate: () => {
    const { year, month } = get().dashboardData.reportInfo;
    set({ reportYear: year, reportMonth: month });
  }
}));
