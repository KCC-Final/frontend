'use client';

import styles from './review-content.module.scss';

import { ReviewDetailResDTO } from '@/types/reviews';

type Props = {
  reviewData: ReviewDetailResDTO['data'];
  isLiked: boolean;
  likeCount: number;
  onLike: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export default function ReviewContent({ reviewData, isLiked, likeCount, onLike, onEdit, onDelete }: Props) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <h1 className={styles.title}>{reviewData.reviewTitle}</h1>

          {/* 여기에 조건 추가 */}
          {reviewData.isOwner && (
            <div className={styles.actions}>
              <button onClick={onEdit} className={styles.editBtn}>
                수정
              </button>
              <button onClick={onDelete} className={styles.deleteBtn}>
                삭제
              </button>
            </div>
          )}
        </div>

        <div className={styles.metadata}>
          <span className={styles.author}>{reviewData.userId}</span>
          <span className={styles.separator}>•</span>
          <span className={styles.date}>{formatDate(reviewData.createdAt)}</span>
          {reviewData.updatedAt && reviewData.updatedAt !== reviewData.createdAt && (
            <>
              <span className={styles.separator}>•</span>
              <span className={styles.updated}>수정됨</span>
            </>
          )}
          {reviewData.secret && (
            <>
              <span className={styles.separator}>•</span>
              <span className={styles.secret}>비밀글</span>
            </>
          )}
        </div>
      </div>

      <div className={styles.content}>
        <div
          className={styles.reviewText}
          dangerouslySetInnerHTML={{
            __html: reviewData.reviewContent.replace(/\n/g, '<br />')
          }}
        />
      </div>

      <div className={styles.footer}>
        <button onClick={onLike} className={`${styles.likeBtn} ${isLiked ? styles.liked : ''}`}>
          <span className={styles.likeIcon}>{isLiked ? '♥' : '♡'}</span>
          <span className={styles.likeCount}>{likeCount}</span>
        </button>
      </div>
    </div>
  );
}
