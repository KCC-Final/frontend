'use client';

import { TrendingUp, TrendingDown, Calendar, Minus } from 'lucide-react';
import { useState } from 'react';

import MonthlyReportSelectModal from '@/components/dashboard/report/monthly-report-select-modal';
import styles from '@/components/dashboard/report/report.module.scss';
import { useDashboardStore } from '@/stores/dashboard';

export default function MonthlyReport() {
  const { dashboardData, changeReportData, resetReportDate } = useDashboardStore();
  const { myAverage, totalAverage, year, month } = dashboardData.reportInfo;

  const [isModalOpen, setModalOpen] = useState(false);

  const difference = myAverage - totalAverage;
  const isAboveAverage = difference > 0;
  const isNeutral = difference === 0;
  const percentageDiff = totalAverage > 0 ? Math.abs((difference / totalAverage) * 100).toFixed(1) : '0';

  /** 모달 닫기 */
  const closeModal = () => {
    setModalOpen(false);
    resetReportDate();
  };

  /** 모달 제출 */
  const submitModal = () => {
    setModalOpen(false);
    changeReportData();
  };

  const getMotivationalMessage = () => {
    if (myAverage > totalAverage * 1.5) {
      return '대단해요! 평균 독서량을 훨씬 뛰어넘었어요!';
    } else if (myAverage > totalAverage * 1.1) {
      return '멋져요! 평균 독서량을 많이 초과했어요!';
    } else if (myAverage > totalAverage * 0.9) {
      return '좋아요! 평균 독서량과 비슷해요!';
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
        <h3 className={styles.title}>이달의 독서 리포트</h3>
        <button className={styles.selectButton} onClick={() => setModalOpen(true)}>
          <Calendar />
          <span>
            {year}년 {month}월
          </span>
        </button>
      </div>

      <div className={styles.reportContent}>
        <div className={styles.reportStat}>
          <span className={styles.statValue}>{myAverage}권</span>
          <span className={styles.statLabel}>나의 독서량</span>
        </div>

        <div className={styles.vsText}>VS</div>

        <div className={styles.reportStat}>
          <span className={styles.statValue}>{totalAverage.toFixed(1)}권</span>
          <span className={styles.statLabel}>평균 독서량</span>
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
      {isModalOpen && <MonthlyReportSelectModal onClose={closeModal} onSubmit={submitModal} />}
    </div>
  );
}
