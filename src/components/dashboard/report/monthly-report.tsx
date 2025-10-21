'use client';

import { TrendingUp, TrendingDown, Calendar, Minus } from 'lucide-react';
import { useState } from 'react';

import MonthlyReportSelectModal from './monthly-report-select-modal';
import styles from './monthly-report.module.scss';

import { fetchGroo } from '@/apis/groo';
import { MonthlyReportProps } from '@/types/dashboard/dashboard';

export default function MonthlyReport({ myCount, averageCount, year, month }: MonthlyReportProps) {
  const [report, setReport] = useState({ myCount, averageCount, year, month });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const difference = report.myCount - report.averageCount;
  const isAboveAverage = difference > 0;
  const isNeutral = difference === 0;
  const percentageDiff =
    report.averageCount > 0 ? Math.abs((difference / report.averageCount) * 100).toFixed(1) : 0;

  const handleSelect = async (selectedYear: number, selectedMonth: number) => {
    try {
      const res = await fetchGroo.dashboard.getMonthlyReport(selectedYear, selectedMonth);
      setReport(res);
    } catch (err) {
      alert('리포트 조회 중 오류가 발생했습니다.');
      console.error(err);
    }
  };

  const getMotivationalMessage = () => {
    if (isAboveAverage) {
      if (difference >= 5) return '훌륭해요! 평균보다 훨씬 많이 읽으셨어요!';
      if (difference >= 3) return '좋아요! 평균보다 더 많이 읽으셨어요!';
      return '평균 이상의 독서량을 달성하셨어요!';
    } else if (isNeutral) {
      return '평균 독서량을 달성하셨어요!';
    } else {
      return '조금만 더 힘내세요! 다음 달엔 더 잘할 수 있어요!';
    }
  };

  const getIndicatorClass = () => {
    if (isAboveAverage) return styles.positive;
    if (isNeutral) return styles.neutral;
    return styles.negative;
  };

  const getIcon = () => {
    if (isAboveAverage) return <TrendingUp size={18} />;
    if (isNeutral) return <Minus size={18} />;
    return <TrendingDown size={18} />;
  };

  return (
    <div className={styles.reportCard}>
      <div className={styles.reportHeader}>
        <h3 className={styles.reportTitle}>📈 이달의 독서 리포트</h3>
        <button className={styles.selectButton} onClick={() => setIsModalOpen(true)}>
          <Calendar />
          <span>
            {report.year}년 {report.month}월
          </span>
        </button>
      </div>

      <div className={styles.reportContent}>
        <div className={styles.reportStat}>
          <span className={styles.statLabel}>나의 독서량</span>
          <span className={styles.statValue}>{report.myCount}권</span>
        </div>

        <div className={styles.vsText}>VS</div>

        <div className={styles.reportStat}>
          <span className={styles.statLabel}>평균 독서량</span>
          <span className={styles.statValue}>{report.averageCount.toFixed(1)}권</span>
        </div>
      </div>

      <div className={styles.reportDifference}>
        <div className={`${styles.differenceIndicator} ${getIndicatorClass()}`}>
          {getIcon()}
          <span>
            평균 대비 {isAboveAverage ? '+' : ''}
            {difference.toFixed(1)}권 ({percentageDiff}%)
          </span>
        </div>
      </div>

      <div className={`${styles.reportFooter} ${isAboveAverage ? styles.positive : styles.negative}`}>
        {getMotivationalMessage()}
      </div>

      {/* 선택 모달 */}
      <MonthlyReportSelectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleSelect}
      />
    </div>
  );
}
