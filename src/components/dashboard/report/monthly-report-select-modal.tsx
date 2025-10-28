'use client';

import { X } from 'lucide-react';

import styles from '@/components/dashboard/report/monthly-report-select-modal.module.scss';
import { useDashboardStore } from '@/stores/dashboard';

interface MonthlyReportSelectModalProps {
  onClose: () => void;
  onSubmit: () => void;
}

export default function MonthlyReportSelectModal({ onClose, onSubmit }: MonthlyReportSelectModalProps) {
  const { reportYear, reportMonth, changeReportYear, changeReportMonth } = useDashboardStore();

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i); // 최근 5년
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <header className={styles.header}>
          <h3 className={styles.title}> 월간 리포트 조회</h3>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={22} />
          </button>
        </header>

        <div className={styles.content}>
          <div className={styles.fieldGroup}>
            <label htmlFor="year-select">연도</label>
            <select id="year-select" value={reportYear} onChange={changeReportYear}>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}년
                </option>
              ))}
            </select>
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="month-select">월</label>
            <select id="month-select" value={reportMonth} onChange={changeReportMonth}>
              {months.map((m) => (
                <option key={m} value={m}>
                  {m}월
                </option>
              ))}
            </select>
          </div>
        </div>

        <footer className={styles.footer}>
          <button className={styles.btnPrimary} onClick={onSubmit}>
            조회하기
          </button>
        </footer>
      </div>
    </div>
  );
}
