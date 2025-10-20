'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';

import BadgeSection from './badges/badge-section';
import CategoryChart from './charts/category-chart';
import MonthlyChart from './charts/monthly-chart';
import YearlyChart from './charts/yearly-chart';
import styles from './dashboard-container.module.scss';
import ProfileSection from './profile/profile-section';
import MonthlyReport from './report/monthly-report';
import StatsCards from './stats/stats-cards';

import { getSummaryStats, getMonthlyStats, getYearlyStats, getMonthlyReport } from '@/apis/groo/dashboard';
import useBoundStore from '@/stores';
import {
  DashboardSummaryResponse,
  MonthlyStatsResponse,
  YearlyStatsResponse,
  MonthlyReportResponse
} from '@/types/dashboard/dashboard';
import { isAuthError } from '@/utils/error/dashboard-error-handler';

export default function DashboardContainer() {
  const router = useRouter();

  // 전역 Store에서 로그인 사용자 정보 가져오기
  const { myInfo } = useBoundStore(useShallow((state) => ({ myInfo: state.myInfo! })));

  // 상태 관리
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [summaryData, setSummaryData] = useState<DashboardSummaryResponse | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyStatsResponse | null>(null);
  const [yearlyData, setYearlyData] = useState<YearlyStatsResponse | null>(null);
  const [reportData, setReportData] = useState<MonthlyReportResponse | null>(null);

  const [viewMode, setViewMode] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - i).reverse();

  // 데이터 로드
  useEffect(() => {
    if (!myInfo) return; // 로그인 정보 없으면 요청 안함
    loadAllDashboardData();
  }, [myInfo]);

  const loadAllDashboardData = async () => {
    try {
      setLoading(true);

      const [summary, monthly, yearly, report] = await Promise.all([
        getSummaryStats(),
        getMonthlyStats(selectedYear),
        getYearlyStats(),
        getMonthlyReport()
      ]);

      setSummaryData(summary);
      setMonthlyData(monthly);
      setYearlyData(yearly);
      setReportData(report);
    } catch (err: any) {
      console.error('❌ 대시보드 데이터 로드 실패:', err);
      if (isAuthError(err)) {
        alert('로그인이 필요합니다.');
        router.push('/login');
        return;
      }
      setError(err.message || '데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 연도 변경 핸들러
  const handleYearChange = async (year: number) => {
    setSelectedYear(year);
    try {
      const newMonthly = await getMonthlyStats(year);
      setMonthlyData(newMonthly);
    } catch (e) {
      console.error('❌ 월별 데이터 갱신 실패:', e);
    }
  };

  const handleViewChange = (mode: 'monthly' | 'yearly') => {
    setViewMode(mode);
  };

  // 로딩/에러 UI
  if (loading)
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>대시보드 로딩중...</p>
      </div>
    );

  if (error)
    return (
      <div className={styles.errorContainer}>
        <p className={styles.errorMessage}>{error}</p>
        <button className={styles.retryButton} onClick={loadAllDashboardData}>
          다시 시도
        </button>
      </div>
    );

  // 실제 렌더링
  return (
    <div className={styles.container}>
      {/* 프로필 섹션 */}
      {myInfo && <ProfileSection nickname={myInfo.nickname} profileImage={myInfo.profileImage} />}

      {/* 통계 카드 */}
      {summaryData && (
        <StatsCards
          totalReviews={summaryData.totalReviews}
          totalScrappedBooks={summaryData.totalScrappedBooks}
          totalLikedReviews={summaryData.totalLikedReviews}
        />
      )}

      {/*  차트 섹션 */}
      <div className={styles.chartsSection}>
        <div className={styles.chartWrapper}>
          <div className={styles.chartHeader}>
            <div className={styles.chartTitleArea}>
              <h3 className={styles.chartTitle}>
                월별 독서 통계
                {viewMode === 'monthly' && (
                  <select
                    className={styles.inlineYearSelect}
                    value={selectedYear}
                    onChange={(e) => handleYearChange(Number(e.target.value))}>
                    {yearOptions.map((year) => (
                      <option key={year} value={year}>
                        {year}년
                      </option>
                    ))}
                  </select>
                )}
              </h3>

              {/* 보기 전환 버튼 */}
              <div className={styles.modeGroup}>
                <button
                  className={`${styles.modeButton} ${viewMode === 'monthly' ? styles.active : ''}`}
                  onClick={() => handleViewChange('monthly')}>
                  월별 보기
                </button>
                <button
                  className={`${styles.modeButton} ${viewMode === 'yearly' ? styles.active : ''}`}
                  onClick={() => handleViewChange('yearly')}>
                  연도별 보기
                </button>
              </div>
            </div>
          </div>

          {/* 차트 본문 */}
          {viewMode === 'monthly' && monthlyData && (
            <MonthlyChart data={monthlyData.monthlyStats} year={selectedYear} />
          )}
          {viewMode === 'yearly' && yearlyData && <YearlyChart data={yearlyData.yearlyStats} />}
        </div>

        {/* 분야별 통계 */}
        {summaryData && summaryData.categoryStats.length > 0 && (
          <CategoryChart data={summaryData.categoryStats} />
        )}
      </div>

      {/* 월간 리포트 */}
      {reportData && (
        <MonthlyReport
          myCount={reportData.myCount}
          averageCount={reportData.averageCount}
          year={reportData.year}
          month={reportData.month}
        />
      )}

      {/* 뱃지 섹션: myInfo.userId 기준으로 */}
      {myInfo && <BadgeSection userId={myInfo.userId} />}
    </div>
  );
}
