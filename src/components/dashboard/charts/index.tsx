import CategoryChart from '@/components/dashboard/charts/category-chart';
import styles from '@/components/dashboard/charts/charts.module.scss';
import MonthlyChart from '@/components/dashboard/charts/monthly-chart';
import YearlyChart from '@/components/dashboard/charts/yearly-chart';
import { useDashboardStore } from '@/stores/dashboard';

function DashboardCharts() {
  const { periodChartType } = useDashboardStore();

  return (
    <section className={styles.chartsSection}>
      {periodChartType === 'monthly' && <MonthlyChart />}
      {periodChartType === 'yearly' && <YearlyChart />}
      <CategoryChart />
    </section>
  );
}

export default DashboardCharts;
