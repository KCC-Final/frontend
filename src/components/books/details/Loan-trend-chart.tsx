'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';

import styles from './Loan-trend-chart.module.scss';

import { fetchLibrary } from '@/apis/library';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

interface LoanTrendData {
  month: string;
  count: number;
  ranking: number;
}

interface LoanTrendChartProps {
  isbn13: string;
}

export default function LoanTrendChart({ isbn13 }: LoanTrendChartProps) {
  const [data, setData] = useState<LoanTrendData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLoanTrend();
  }, [isbn13]);

  const loadLoanTrend = async () => {
    try {
      setLoading(true);
      const res = await fetchLibrary.getBookUsageAnalysis(isbn13);

      console.log('[LoanTrend] raw response:', res);

      const historyRoot =
        res?.response?.loanHistory ?? res?.data?.response?.loanHistory ?? res?.loanHistory ?? res;

      let historyList: any[] = [];
      if (Array.isArray(historyRoot)) {
        historyList = historyRoot;
      } else if (Array.isArray(historyRoot?.loan)) {
        historyList = historyRoot.loan;
      } else if (historyRoot?.loan) {
        historyList = [historyRoot.loan];
      }

      console.log('[LoanTrend] parsed historyList:', historyList);

      const formatted: LoanTrendData[] = historyList
        .map((item: any) => item?.loan ?? item)
        .filter((it: any) => it && it.month)
        .map((it: any) => ({
          month: String(it.month),
          count: Number.parseInt(String(it.loanCnt ?? it.count ?? 0), 10) || 0,
          ranking: Number.parseInt(String(it.ranking ?? 0), 10) || 0
        }));

      setData(formatted.slice(-12)); // 최근 12개월만 표시
    } catch (err) {
      console.error('대출 추이 데이터 불러오기 실패:', err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className={styles.loan_trend_section}>
        <h2 className={styles.section_title}>대출 추이</h2>
        <p>로딩 중...</p>
      </section>
    );
  }

  if (data.length === 0) return null;

  const chartData = {
    labels: data.map((d) => d.month),
    datasets: [
      {
        label: '대출 건수',
        data: data.map((d) => d.count),
        borderColor: '#007664',
        backgroundColor: 'rgba(0, 118, 100, 0.1)',
        fill: true,
        tension: 0.3,
        pointRadius: 4,
        pointBackgroundColor: '#007664',
        pointBorderWidth: 0
      }
    ]
  };

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: { color: '#eee' },
        ticks: { color: '#666' }
      },
      y: {
        grid: { color: '#eee' },
        ticks: { color: '#666' },
        beginAtZero: true,
        title: {
          display: true,
          text: '대출 권수',
          color: '#444',
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true }
    }
  };

  return (
    <div className={styles.loan_trend_section}>
      <h2 className={styles.section_title}>대출 추이</h2>

      <div className={styles.chart_container}>
        <div className={styles.chart_wrapper}>
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>

      <div className={styles.data_section}>
        <div className={styles.data_table_two_column}>
          <table>
            <thead>
              <tr>
                <th>대출연월</th>
                <th>대출건수</th>
                <th>대출순위</th>
              </tr>
            </thead>
            <tbody>
              {data.slice(0, 6).map((d, i) => (
                <tr key={i}>
                  <td>{d.month}</td>
                  <td>{d.count.toLocaleString()}</td>
                  <td>{d.ranking.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <table>
            <thead>
              <tr>
                <th>대출연월</th>
                <th>대출건수</th>
                <th>대출순위</th>
              </tr>
            </thead>
            <tbody>
              {data.slice(6, 12).map((d, i) => (
                <tr key={i + 6}>
                  <td>{d.month}</td>
                  <td>{d.count.toLocaleString()}</td>
                  <td>{d.ranking.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
