import { CommonResDTO, FollowUserInfo } from '@/types';

export interface MonthlyStat {
  month: string;
  count: number;
}

export interface YearlyStat {
  year: number;
  count: number;
}

export interface CategoryStat {
  category: string;
  count: number;
}

export interface ReportInfo {
  myAverage: number;
  totalAverage: number;
  year: number;
  month: number;
}

export interface DashboardAllData {
  followers: FollowUserInfo[];
  followings: FollowUserInfo[];
  totalReviews: number;
  totalScrappedBooks: number;
  totalLikedReviews: number;
  monthlyStats: MonthlyStat[];
  yearlyStats: YearlyStat[];
  categoryStats: CategoryStat[];
  reportInfo: ReportInfo;
}

export type GetAllDashboardDataResDTO = CommonResDTO<DashboardAllData>;
