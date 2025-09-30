'use client';

import { useState, useEffect } from 'react';

import { fetchGroo } from '@/apis';
import styles from '@/components/reviews/write/draft-list-modal.module.scss';
import { DraftData } from '@/types/reviews';

interface DraftListModalProps {
  onClose: () => void;
  onSelect: (draftId: number) => void;
}

function DraftListModal({ onClose, onSelect }: DraftListModalProps) {
  const [drafts, setDrafts] = useState<DraftData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDrafts();
  }, []);

  const loadDrafts = async () => {
    try {
      const response = await fetchGroo.review.getDrafts();
      setDrafts(response.data || []);
    } catch (error) {
      console.error('임시저장 목록 조회 실패:', error);
      alert('임시저장 목록을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (draftId: number, e: React.MouseEvent) => {
    e.stopPropagation();

    if (!confirm('이 임시저장 글을 삭제하시겠습니까?')) {
      return;
    }

    try {
      await fetchGroo.review.deleteDraft(draftId);
      alert('삭제되었습니다.');
      setDrafts(drafts.filter((draft) => draft.reviewId !== draftId));
    } catch (error) {
      console.error('임시저장 글 삭제 실패:', error);
      alert('삭제에 실패했습니다.');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div
      className={styles.modalOverlay}
      onClick={onClose}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Escape' && onClose()}>
      <div className={styles.modalContent} role="document">
        <div className={styles.modalHeader}>
          <h2>임시저장 목록</h2>
          <button onClick={onClose} className={styles.closeButton}>
            ✕
          </button>
        </div>

        <div className={styles.draftList}>
          {isLoading ? (
            <div className={styles.loading}>불러오는 중...</div>
          ) : drafts.length === 0 ? (
            <div className={styles.emptyState}>임시저장된 글이 없습니다.</div>
          ) : (
            drafts.map((draft) => (
              <li key={draft.reviewId} className={styles.draftItem}>
                <button onClick={() => onSelect(draft.reviewId)} className={styles.draftContent}>
                  <div className={styles.draftInfo}>
                    <h3 className={styles.draftTitle}>{draft.reviewTitle || '제목 없음'}</h3>
                    <p className={styles.draftDate}>{formatDate(draft.updatedAt || draft.createdAt)}</p>
                    <p className={styles.draftIsbn}>ISBN: {draft.isbn}</p>
                  </div>
                </button>
                <button onClick={(e) => handleDelete(draft.reviewId, e)} className={styles.deleteButton}>
                  삭제
                </button>
              </li>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default DraftListModal;
