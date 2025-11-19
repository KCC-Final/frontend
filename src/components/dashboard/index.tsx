'use client';

import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';

import PageLoading from '../common/loading';

import UserProfileCard from '@/components/common/profile/card';
import BadgeSection from '@/components/dashboard/badges/badge-section';
import DashboardCharts from '@/components/dashboard/charts';
import MonthlyReport from '@/components/dashboard/report';
import StatsCards from '@/components/dashboard/stats/stats-cards';
import useBoundStore from '@/stores';
import { useDashboardStore } from '@/stores/dashboard';

export default function DashboardContainer() {
  const { myInfo } = useBoundStore(useShallow((state) => ({ myInfo: state.myInfo })));

  const { dashboardData, loading, fetchAllDashboardData } = useDashboardStore();

  useEffect(() => {
    if (myInfo) {
      fetchAllDashboardData();
    }
  }, [myInfo, fetchAllDashboardData]);

  if (loading) return <PageLoading />;

  if (!dashboardData) return null;

  return (
    <>
      {myInfo && <UserProfileCard userId={myInfo.userId} />}
      <StatsCards />
      <DashboardCharts />
      <MonthlyReport />
      <BadgeSection />
    </>
  );
}
