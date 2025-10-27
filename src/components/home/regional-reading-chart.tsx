'use client';

import Chart from 'chart.js/auto';
import { useEffect, useRef, useState } from 'react';

import styles from './regional-reading-chart.module.scss';

import { fetchLibrary } from '@/apis/library';
import { regionList } from '@/types/common/region'; // 지역 코드 import

interface ReadingStat {
  region: string;
  quantity: number;
  rate: number;
}

export default function RegionalReadingChart() {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const [stats, setStats] = useState<ReadingStat[]>([]);

  // 지역별 독서량 불러오기 (직접 로직 처리)
  useEffect(() => {
    const load = async () => {
      try {
        // 지역별 API 호출 (병렬 요청)
        const requests = regionList.map(async (r) => {
          try {
            const data = await fetchLibrary.getRegionalReadingRaw(r.code);
            const item = data?.response?.results?.[0]?.result;

            if (!item) {
              console.warn(`[READ_QT][${r.name}] result 없음`);
              return null;
            }

            return {
              region: r.name,
              quantity: parseFloat(item.quantity ?? 0),
              rate: parseFloat(item.rate ?? 0)
            };
          } catch (e) {
            console.error(`[READ_QT_ERROR][${r.name}]`, e);
            return null;
          }
        });

        const results = await Promise.all(requests);
        console.log('지역별 통계 원본:', results);

        // 유효 데이터만 필터링
        const validResults = results.filter((r): r is ReadingStat => !!r && typeof r.quantity === 'number');

        if (validResults.length === 0) {
          console.warn(' 지역별 독서 통계 데이터가 비어있음');
          return;
        }

        // 정렬 후 상태 업데이트
        const sorted = [...validResults].sort((a, b) => b.quantity - a.quantity);
        console.log('정렬된 데이터:', sorted);
        setStats(sorted);
      } catch (err) {
        console.error('지역별 독서 통계 불러오기 실패:', err);
      }
    };
    load();
  }, []);

  // 차트 렌더링
  useEffect(() => {
    if (!chartRef.current || stats.length === 0) return;

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: stats.map((s) => s.region),
        datasets: [
          {
            label: '1인당 평균 독서권수',
            data: stats.map((s) => s.quantity),
            backgroundColor: 'rgba(0, 118, 100, 0.7)',
            borderRadius: 6,
            yAxisID: 'y'
          },
          {
            label: '독서율(%)',
            data: stats.map((s) => s.rate * 100),
            type: 'line',
            borderColor: '#F59E0B',
            borderWidth: 2,
            pointBackgroundColor: '#FBBF24',
            tension: 0.3,
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: {
            display: true,
            labels: { boxWidth: 12, font: { size: 12 } }
          },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const y = ctx.parsed?.y ?? 0;
                if (ctx.dataset.label === '1인당 평균 독서권수') return `${y.toFixed(1)} 권`;
                if (ctx.dataset.label === '독서율(%)') return `${y.toFixed(1)} %`;
                return '';
              }
            }
          },
          title: {
            display: true,
            text: ' 전국 지역별 독서량 & 독서율 비교',
            font: { size: 18, weight: 'bold' },
            color: '#111827',
            padding: { bottom: 12 }
          }
        },
        scales: {
          x: {
            ticks: { font: { size: 12 }, color: '#374151' },
            grid: { display: false }
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: '독서권수',
              color: '#007664',
              font: { size: 13, weight: 'bold' }
            },
            ticks: { color: '#6b7280', stepSize: 5 },
            grid: { color: 'rgba(200,200,200,0.1)' }
          },
          y1: {
            beginAtZero: true,
            position: 'right',
            title: {
              display: true,
              text: '독서율(%)',
              color: '#F59E0B',
              font: { size: 13, weight: 'bold' }
            },
            ticks: {
              color: '#F59E0B',
              callback: (v) => `${v}%`
            },
            grid: { drawOnChartArea: false }
          }
        }
      }
    });

    return () => chart.destroy();
  }, [stats]);

  if (stats.length === 0) return null;

  return (
    <section className={styles.chartSection}>
      <div className={styles.chartWrapper}>
        <canvas ref={chartRef} className={styles.chartCanvas}></canvas>
      </div>
    </section>
  );
}
