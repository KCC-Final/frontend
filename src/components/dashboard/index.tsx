'use client';

import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';

import UserProfileCard from '@/components/common/profile';
import BadgeSection from '@/components/dashboard/badges/badge-section';
import DashboardCharts from '@/components/dashboard/charts';
import styles from '@/components/dashboard/dashboard.module.scss';
import MonthlyReport from '@/components/dashboard/report';
import StatsCards from '@/components/dashboard/stats/stats-cards';
import useBoundStore from '@/stores';
import { useDashboardStore } from '@/stores/dashboard';

export default function DashboardContainer() {
  const { myInfo } = useBoundStore(useShallow((state) => ({ myInfo: state.myInfo! })));

  const { dashboardData, loading, fetchAllDashboardData } = useDashboardStore();

  useEffect(() => {
    if (myInfo) {
      fetchAllDashboardData();
    }
  }, [myInfo, fetchAllDashboardData]);

  if (loading)
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>대시보드 로딩중...</p>
      </div>
    );

  if (!dashboardData) return null;

  return (
    <>
      {myInfo && <UserProfileCard />}
      <StatsCards />
      <DashboardCharts />
      <MonthlyReport />
      <BadgeSection />
    </>
  );
}
