'use client';

import Chart from 'chart.js/auto';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';

import styles from '@/components/dashboard/charts/charts.module.scss';
import { useDashboardStore } from '@/stores/dashboard';

export default function MonthlyChart() {
  const { dashboardData, periodChartType, periodChartYear, changePeriodChartType, changePeriodChartYear } =
    useDashboardStore();
  const { monthlyStats } = dashboardData;

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

      if (!monthlyStats || !Array.isArray(monthlyStats)) {
        setChartError('유효하지 않은 데이터입니다.');
        return;
      }

      const monthLabels = [
        '1월',
        '2월',
        '3월',
        '4월',
        '5월',
        '6월',
        '7월',
        '8월',
        '9월',
        '10월',
        '11월',
        '12월'
      ];

      const monthlyData = new Array(12).fill(0);
      monthlyStats.forEach((item) => {
        const month = parseInt(item.month.split('-')[1]) - 1;
        if (month >= 0 && month < 12) {
          monthlyData[month] = item.count;
        }
      });

      const maxValue = Math.max(...monthlyData);
      const suggestedMax = Math.max(Math.ceil((maxValue * 1.1) / 10) * 10, 10);

      // 데이터 없어도 무조건 차트 표시
      chartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: monthLabels,
          datasets: [
            {
              label: '독후감 수',
              data: monthlyData,
              backgroundColor: 'rgba(45, 90, 61, 0.7)',
              borderColor: 'rgba(45, 90, 61, 1)',
              borderWidth: 1,
              borderRadius: 5,
              hoverBackgroundColor: 'rgba(45, 90, 61, 0.9)',
              barThickness: 25, // 막대 두께 약간 줄임
              maxBarThickness: 30
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
  }, [monthlyStats]);

  const yearOptions = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).reverse();

  return (
    <div className={styles.chartCard}>
      <div className={styles.chartHeader}>
        <div className={styles.chartTitleContainer}>
          <h3 className={styles.chartTitle}>월별 독서 통계</h3>
          <select value={periodChartYear} onChange={changePeriodChartYear}>
            {yearOptions.map((year) => (
              <option key={year} value={year}>
                {year}년
              </option>
            ))}
          </select>
        </div>
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
