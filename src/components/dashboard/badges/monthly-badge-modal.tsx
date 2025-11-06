'use client';

import { useEffect, useState } from 'react';

import styles from './monthly-badge-modal.module.scss';

import { challenge } from '@/apis/groo/challenge';
import { UserBadgeResponse, UserBadgeStatusResponse } from '@/types';

interface MonthlyBadgeModalProps {
  userId: string;
  onClose: () => void;
  badgeId?: number; // 히스토리형 뱃지 ID (이달의 독서왕)
  badge?: UserBadgeStatusResponse; // 일반 뱃지 정보
}

export default function MonthlyBadgeModal({ userId, onClose, badgeId, badge }: MonthlyBadgeModalProps) {
  const [history, setHistory] = useState<UserBadgeResponse[]>([]);
  const [loading, setLoading] = useState(true);

  // 히스토리형 뱃지인 경우
  const isHistoryMode = badgeId !== undefined;

  useEffect(() => {
    if (isHistoryMode) {
      const loadHistory = async () => {
        try {
          const data = await challenge.getBadgeHistory(userId, badgeId);
          setHistory(data);
        } catch (error) {
        } finally {
          setLoading(false);
        }
      };
      loadHistory();
    } else {
      setLoading(false);
    }
  }, [userId, badgeId, isHistoryMode]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}년 ${month}월 ${day}일`;
  };

  const formatMonthForHistory = (dateString: string) => {
    const date = new Date(dateString);
    // 매월 1일에 전월 독서왕을 부여하므로, 표시할 때는 -1개월
    const year = date.getMonth() === 0 ? date.getFullYear() - 1 : date.getFullYear();
    const month = date.getMonth() === 0 ? 12 : date.getMonth();
    return `${year}년 ${month}월`;
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <header>
          <h2>{badge?.badgeName}</h2>
          <button onClick={onClose}>✕</button>
        </header>

        {loading ? (
          <p className={styles.loading}>불러오는 중...</p>
        ) : (
          <>
            {/* 일반 뱃지 정보 (모든 뱃지 공통) */}
            <div className={styles.detailContent}>
              <p className={styles.description}>{badge?.badgeDescription}</p>
              <div className={styles.acquiredInfo}>
                <span className={styles.label}>획득일</span>
                <span className={styles.date}>{badge?.acquiredDate && formatDate(badge.acquiredDate)}</span>
              </div>
            </div>

            {/* 히스토리 모드인 경우 추가 표시 */}
            {isHistoryMode && (
              <div className={styles.historySection}>
                <h3 className={styles.historyTitle}>수상 이력</h3>
                {history.length === 0 ? (
                  <p className={styles.empty}>이전 수상 이력이 없습니다.</p>
                ) : (
                  <ul className={styles.list}>
                    {history.map((h, idx) => (
                      <li key={idx}>
                        <span className={styles.date}>{formatMonthForHistory(h.succeededAt)}</span>
                        <span className={styles.desc}>{h.badgeDescription}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
