'use client';

import { useState, useEffect, useRef } from 'react';

import { fetchGroo } from '@/apis';
import styles from '@/components/reviews/write/draft-list-modal.module.scss';
import { DraftData } from '@/types/reviews';
import { getReviewErrorMessage } from '@/utils/error/review-error-handler';

interface DraftListModalProps {
  onClose: () => void;
  onSelect: (draftId: number) => void;
}

function DraftListModal({ onClose, onSelect }: DraftListModalProps) {
  const [drafts, setDrafts] = useState<DraftData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const modalContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadDrafts();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const loadDrafts = async () => {
    try {
      const drafts = await fetchGroo.review.getDrafts();
      setDrafts(drafts || []);
    } catch (error: any) {
      alert(getReviewErrorMessage(error));
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
    } catch (error: any) {
      alert(getReviewErrorMessage(error));
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Seoul'
    });
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalContentRef.current && !modalContentRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const handleDraftSelect = (draftId: number) => {
    onSelect(draftId);
  };

  return (
    <div
      className={styles.modalOverlay}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title">
      <div className={styles.modalContent} ref={modalContentRef}>
        <div className={styles.modalHeader}>
          <h2 id="modal-title">임시저장 목록</h2>
          <button onClick={onClose} className={styles.closeButton} aria-label="모달 닫기" type="button">
            ✕
          </button>
        </div>

        <div className={styles.draftList}>
          {isLoading ? (
            <div className={styles.loading}>불러오는 중...</div>
          ) : drafts.length === 0 ? (
            <div className={styles.emptyState}>임시저장된 글이 없습니다.</div>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {drafts.map((draft) => (
                <li key={draft.reviewId} className={styles.draftItem}>
                  <button
                    className={styles.draftContent}
                    onClick={() => handleDraftSelect(draft.reviewId)}
                    aria-label={`${draft.reviewTitle || '제목 없음'} 불러오기`}
                    type="button">
                    <div className={styles.draftInfo}>
                      <h3 className={styles.draftTitle}>{draft.reviewTitle || '제목 없음'}</h3>
                      <p className={styles.draftDate}>{formatDate(draft.updatedAt || draft.createdAt)}</p>
                      <p className={styles.draftIsbn}>ISBN: {draft.isbn}</p>
                      {draft.category && <p className={styles.draftCategory}>분야: {draft.category}</p>}
                    </div>
                  </button>
                  <button
                    onClick={(e) => handleDelete(draft.reviewId, e)}
                    className={styles.deleteButton}
                    aria-label={`${draft.reviewTitle || '제목 없음'} 삭제`}
                    type="button">
                    삭제
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default DraftListModal;
