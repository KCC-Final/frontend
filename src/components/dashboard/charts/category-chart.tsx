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
  const [expanded, setExpanded] = useState(false); // 전체보기 상태

  useEffect(() => {
    if (!chartRef.current) return;

    // 기존 차트 제거
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    // 데이터가 없을 경우 처리
    if (!data || data.length === 0) return;

    // 상위 5개 + etc 그룹화
    const sortedData = [...data].sort((a, b) => b.count - a.count);
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
    const total = values.reduce((a, b) => a + b, 0);

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
            borderWidth: 2,
            hoverOffset: 8
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              padding: 15,
              font: { size: 12 },
              color: '#333',
              // 범례 클릭 비활성화
              usePointStyle: true,
              generateLabels: (chart): import('chart.js').LegendItem[] => {
                const dataset = chart.data.datasets[0];
                const labels = chart.data.labels ?? []; // undefined 방지

                if (!dataset) return [];

                return labels.map((label, i) => {
                  const value = dataset.data?.[i] as number;
                  const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';

                  // 타입 안정성을 위해 as const로 명시
                  return {
                    text: `${label}: ${value}권 (${percentage}%)`,
                    fillStyle: Array.isArray(dataset.backgroundColor)
                      ? (dataset.backgroundColor[i] ?? '#000')
                      : (dataset.backgroundColor ?? '#000'),
                    strokeStyle: Array.isArray(dataset.borderColor)
                      ? (dataset.borderColor[i] ?? '#000')
                      : (dataset.borderColor ?? '#000'),
                    lineWidth: typeof dataset.borderWidth === 'number' ? dataset.borderWidth : 1,
                    hidden: false,
                    index: i
                  } as import('chart.js').LegendItem;
                });
              }
            },
            // 클릭 시 토글 비활성화
            onClick: () => null
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleFont: { size: 13 },
            bodyFont: { size: 12 },
            padding: 10,
            cornerRadius: 5,
            displayColors: true,
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.parsed;
                const percentage = ((value / total) * 100).toFixed(1);
                return `${label}: ${value}권 (${percentage}%)`;
              }
            }
          }
        },
        cutout: '65%', // 내부 구멍 확대 (기존 60%)
        radius: '85%', // 전체 크기 줄임 (기본 100%)
        animation: {
          animateRotate: true,
          duration: 1000,
          easing: 'easeInOutCubic'
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, expanded]);

  return (
    <div className={styles.chartCard}>
      <div className={styles.chartHeader}>
        <h3 className={styles.chartTitle}>분야별 독서 통계</h3>
      </div>
      <div className={styles.chartContainer}>
        <canvas ref={chartRef}></canvas>
      </div>

      {/* 전체보기 버튼 */}
      {data.length > 5 && (
        <div className={styles.chartFooter}>
          <button className={styles.expandButton} onClick={() => setExpanded((prev) => !prev)}>
            {expanded ? '간략히 보기' : '전체 보기'}
          </button>
        </div>
      )}
    </div>
  );
}
