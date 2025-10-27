'use client';

import Chart from 'chart.js/auto';
import { useEffect, useRef, useState } from 'react';

import styles from './charts.module.scss';

import { CategoryChartProps } from '@/types/dashboard/dashboard';

const CATEGORY_COLORS = {
  backgroundColor: [
    'rgba(233, 30, 99, 0.8)',
    'rgba(102, 187, 106, 0.8)',
    'rgba(66, 165, 245, 0.8)',
    'rgba(255, 202, 40, 0.8)',
    'rgba(171, 71, 188, 0.8)',
    'rgba(158, 158, 158, 0.8)',
    'rgba(255, 138, 101, 0.8)',
    'rgba(129, 212, 250, 0.8)'
  ],
  borderColor: [
    'rgba(233, 30, 99, 1)',
    'rgba(102, 187, 106, 1)',
    'rgba(66, 165, 245, 1)',
    'rgba(255, 202, 40, 1)',
    'rgba(171, 71, 188, 1)',
    'rgba(158, 158, 158, 1)',
    'rgba(255, 138, 101, 1)',
    'rgba(129, 212, 250, 1)'
  ]
};

export default function CategoryChart({ data }: CategoryChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!chartRef.current) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    // 데이터 처리 로직
    const hasData = Array.isArray(data) && data.length > 0;
    const validData = hasData ? data : [{ category: '데이터 없음', count: 1 }];

    const sortedData = [...validData].sort((a, b) => b.count - a.count);

    const topFive = sortedData.slice(0, 5);
    const others = sortedData.slice(5);

    let chartData = topFive;
    if (!expanded && others.length > 0) {
      const etcCount = others.reduce((sum, item) => sum + item.count, 0);
      chartData = [...topFive, { category: '기타', count: etcCount }];
    } else if (expanded) {
      chartData = sortedData;
    }

    const labels = chartData.map((item) => item.category);
    const values = chartData.map((item) => item.count);

    chartInstance.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [
          {
            label: '독서 권수',
            data: values,
            backgroundColor: CATEGORY_COLORS.backgroundColor.slice(0, chartData.length),
            borderColor: CATEGORY_COLORS.borderColor.slice(0, chartData.length),
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: hasData },
          tooltip: { enabled: hasData }
        },
        cutout: '65%',
        radius: '85%'
      }
    });

    return () => {
      chartInstance.current?.destroy();
    };
  }, [data, expanded]);

  // 오버레이 표시 조건
  const showOverlay = !Array.isArray(data) || data.length === 0;

  return (
    <div className={styles.chartCard}>
      <div className={styles.chartHeader}>
        <h3 className={styles.chartTitle}>분야별 독서 통계</h3>
      </div>
      <div className={styles.chartContainer}>
        <canvas ref={chartRef}></canvas>
        {showOverlay && (
          <div className={styles.chartOverlay}>
            <p>
              작성한 독후감이 없습니다.
              <br />
              독후감을 작성해 보세요.
            </p>
          </div>
        )}
      </div>

      {Array.isArray(data) && data.length > 5 && (
        <div className={styles.chartFooter}>
          <button className={styles.expandButton} onClick={() => setExpanded((prev) => !prev)}>
            {expanded ? '간략히 보기' : '전체 보기'}
          </button>
        </div>
      )}
    </div>
  );
}
