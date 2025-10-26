import { CategoryStat, MonthlyStat, YearlyStat } from '@/types';

export interface DashboardSummaryResponse {
  totalReviews: number;
  totalScrappedBooks: number;
  totalLikedReviews: number;
  categoryStats: CategoryStat[];
}

export interface MonthlyStatsResponse {
  monthlyStats: MonthlyStat[];
}

export interface YearlyStatsResponse {
  yearlyStats: YearlyStat[];
}

export interface MonthlyReportResponse {
  myCount: number;
  averageCount: number;
  year: number;
  month: number;
}

export interface ProfileSectionProps {
  nickname: string;
  followers: number;
  following: number;
  profileImage: string | null;
}

export interface StatsCardsProps {
  totalReviews: number;
  totalScrappedBooks: number;
  totalLikedReviews: number;
}

export interface MonthlyChartProps {
  data: MonthlyStat[];
  year: number;
}

export interface YearlyChartProps {
  data: YearlyStat[];
}

export interface CategoryChartProps {
  data: CategoryStat[];
}

export interface MonthlyReportProps {
  myCount: number;
  averageCount: number;
  year: number;
  month: number;
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
  borderRadius?: number;
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}
