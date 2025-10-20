'use client';

import { X } from 'lucide-react';
import { useState } from 'react';

import styles from './monthly-report-select-modal.module.scss';

interface MonthlyReportSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (year: number, month: number) => void;
}

export default function MonthlyReportSelectModal({
  isOpen,
  onClose,
  onSelect
}: MonthlyReportSelectModalProps) {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState(currentMonth);

  const years = Array.from({ length: 5 }, (_, i) => currentYear - i); // 최근 5년
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onSelect(year, month);
    onClose();
  };

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
            <select id="year-select" value={year} onChange={(e) => setYear(Number(e.target.value))}>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}년
                </option>
              ))}
            </select>
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="month-select">월</label>
            <select id="month-select" value={month} onChange={(e) => setMonth(Number(e.target.value))}>
              {months.map((m) => (
                <option key={m} value={m}>
                  {m}월
                </option>
              ))}
            </select>
          </div>
        </div>

        <footer className={styles.footer}>
          <button className={styles.btnPrimary} onClick={handleConfirm}>
            조회하기
          </button>
        </footer>
      </div>
    </div>
  );
}
