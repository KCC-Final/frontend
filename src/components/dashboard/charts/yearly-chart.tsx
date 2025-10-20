'use client';

import Chart from 'chart.js/auto';
import { useEffect, useRef, useState } from 'react';

import styles from './charts.module.scss';

import { YearlyChartProps } from '@/types/dashboard/dashboard';

export default function YearlyChart({ data }: YearlyChartProps) {
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

      if (!data || !Array.isArray(data)) {
        setChartError('유효하지 않은 데이터입니다.');
        return;
      }

      // 최근 5년 기준 (누락된 연도는 0으로 채움)
      const currentYear = new Date().getFullYear();
      const yearRange = Array.from({ length: 5 }, (_, i) => currentYear - 4 + i);
      const filledData = yearRange.map((year) => {
        const found = data.find((item) => item.year === year);
        return { year, count: found ? found.count : 0 };
      });

      const yearLabels = filledData.map((item) => `${item.year}년`);
      const counts = filledData.map((item) => item.count);

      const maxValue = Math.max(...counts);
      const suggestedMax = Math.max(50, Math.ceil((maxValue * 1.1) / 10) * 10);

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
              borderWidth: 2,
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
                stepSize: 10,
                color: '#666',
                font: { size: 11 }
              },
              grid: { color: 'rgba(0, 0, 0, 0.05)' },
              border: { display: false },
              suggestedMax
            },
            x: {
              ticks: { color: '#666', font: { size: 11 } },
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
  }, [data]);

  return (
    <div className={styles.chartCard}>
      <div className={styles.chartHeader}>
        <h3 className={styles.chartTitle}>연도별 독서 통계</h3>
      </div>
      <div className={styles.chartContainer}>
        {chartError ? <p className={styles.chartError}>{chartError}</p> : <canvas ref={chartRef}></canvas>}
      </div>
    </div>
  );
}
