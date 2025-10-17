export interface CategoryStat {
  category: string;
  count: number;
}

export interface MonthlyStat {
  month: string; // YYYY-MM format
  count: number;
}

export interface YearlyStat {
  year: number; // 연도
  count: number; // 해당 연도의 독후감 수
}

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
