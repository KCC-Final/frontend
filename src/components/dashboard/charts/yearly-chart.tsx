'use client';

import Chart from 'chart.js/auto';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';

import styles from '@/components/dashboard/charts/charts.module.scss';
import { useDashboardStore } from '@/stores/dashboard';

export default function YearlyChart() {
  const { dashboardData, periodChartType, changePeriodChartType } = useDashboardStore();
  const { yearlyStats } = dashboardData;

  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  const [chartError, setChartError] = useState<string | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    try {
      setChartError(null);
      if (chartInstance.current) chartInstance.current.destroy();

      const ctx = chartRef.current.getContext('2d');
      if (!ctx) {
        setChartError('차트를 렌더링할 수 없습니다.');
        return;
      }

      if (!yearlyStats || !Array.isArray(yearlyStats)) {
        setChartError('유효하지 않은 데이터입니다.');
        return;
      }

      const yearRange = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 4 + i);
      const filledData = yearRange.map((year) => {
        const found = yearlyStats.find((item) => item.year === year);
        return { year, count: found ? found.count : 0 };
      });

      const yearLabels = filledData.map((item) => `${item.year}년`);
      const counts = filledData.map((item) => item.count);

      const maxValue = Math.max(...counts);
      const suggestedMax = Math.max(Math.ceil((maxValue * 1.1) / 10) * 10, 10);

      // 항상 차트 표시 (데이터 없어도 틀 유지)
      chartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: yearLabels,
          datasets: [
            {
              label: '연도별 독후감 수',
              data: counts,
              backgroundColor: 'rgba(45, 90, 61, 0.7)',
              borderColor: 'rgba(45, 90, 61, 1)',
              borderWidth: 1,
              borderRadius: 5,
              hoverBackgroundColor: 'rgba(45, 90, 61, 0.9)',
              barThickness: 40, // 막대 두께 조정 (기존보다 슬림)
              maxBarThickness: 45 // 최대 두께 제한
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              callbacks: {
                label: (context) => `독후감: ${context.parsed.y}권`
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: suggestedMax / 5,
                color: '#777777',
                font: { size: 12 }
              },
              grid: { color: 'rgba(0, 0, 0, 0.05)' },
              border: { display: false },
              suggestedMax
            },
            x: {
              ticks: { color: '#777777', font: { size: 12 } },
              grid: { display: false },
              border: { display: false }
            }
          }
        }
      });
    } catch (err) {
      console.error(err);
      setChartError('차트 렌더링 중 오류가 발생했습니다.');
    }

    return () => {
      if (chartInstance.current) chartInstance.current.destroy();
    };
  }, [yearlyStats]);

  return (
    <div className={styles.chartCard}>
      <div className={styles.chartHeader}>
        <h3 className={styles.chartTitle}>연도별 독서 통계</h3>
        <div className={styles.chartTypeButtons}>
          <button
            className={clsx({ [styles.active]: periodChartType === 'monthly' })}
            onClick={changePeriodChartType('monthly')}>
            월별
          </button>
          <button
            className={clsx({ [styles.active]: periodChartType === 'yearly' })}
            onClick={changePeriodChartType('yearly')}>
            연별
          </button>
        </div>
      </div>
      <div className={styles.chartContainer}>
        {chartError ? <p className={styles.chartError}>{chartError}</p> : <canvas ref={chartRef}></canvas>}
      </div>
    </div>
  );
}
