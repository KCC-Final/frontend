'use client';

import Chart from 'chart.js/auto';
import { useEffect, useRef, useState } from 'react';

import styles from './charts.module.scss';

import { MonthlyChartProps } from '@/types/dashboard/dashboard';

export default function MonthlyChart({ data, year }: MonthlyChartProps) {
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
      data.forEach((item) => {
        const month = parseInt(item.month.split('-')[1]) - 1;
        if (month >= 0 && month < 12) {
          monthlyData[month] = item.count;
        }
      });

      const maxValue = Math.max(...monthlyData);
      const suggestedMax = Math.max(50, Math.ceil((maxValue * 1.1) / 10) * 10);

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
              borderWidth: 2,
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
  }, [data, year]);

  return (
    <div className={styles.chartCard}>
      <div className={styles.chartHeader}></div>
      <div className={styles.chartContainer}>
        {chartError ? <p className={styles.chartError}>{chartError}</p> : <canvas ref={chartRef}></canvas>}
      </div>
    </div>
  );
}
