import { Lock } from 'lucide-react';

import styles from './review-card.module.scss';

import BookCover from '@/components/reviews/commons/book-cover';
import { ReviewData } from '@/types/reviews';
import { changeImageUrlFromBase64 } from '@/utils/format/base64';

interface ReviewCardProps {
  review: ReviewData;
  onClick: (reviewId: number) => void;
  showSecretBadge?: boolean;
}

export default function ReviewCard({ review, onClick, showSecretBadge = true }: ReviewCardProps) {
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const getInitial = (name: string) => (name ? name.charAt(0).toUpperCase() : 'U');

  const convertedProfileImage = changeImageUrlFromBase64(review.authorProfileImage);

  return (
    <article className={styles.reviewCard} onClick={() => onClick(review.reviewId)}>
      <BookCover
        isbn={review.isbn}
        title={review.reviewTitle}
        className={styles.bookCover}
        imageClassName={styles.coverImage}
        noImageClassName={styles.noImage}
      />

      <div className={styles.reviewInfo}>
        <div className={styles.userInfo}>
          {convertedProfileImage ? (
            <img
              src={convertedProfileImage}
              alt={review.authorNickname || review.userId}
              className={styles.avatar}
            />
          ) : (
            <div className={styles.avatarPlaceholder}>
              {getInitial(review.authorNickname || review.userId)}
            </div>
          )}
          <div className={styles.userDetails}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span className={styles.nickname}>{review.authorNickname || review.userId}</span>
              {showSecretBadge && review.secret && (
                <div className={styles.secretBadge}>
                  <Lock size={16} />
                </div>
              )}
            </div>
            <span className={styles.date}>{formatDate(review.createdAt)}</span>
          </div>
        </div>

        <h2 className={styles.reviewTitle}>{review.reviewTitle}</h2>

        <p className={styles.category}>{review.category}</p>

        <div className={styles.reviewContent}>
          {review.reviewContent?.replace(/<[^>]*>/g, '').substring(0, 100)}...
        </div>

        <div className={styles.stats}>
          <span className={styles.stat}>좋아요 {review.likeCount || 0}</span>
          <span className={styles.stat}>댓글 {review.commentCount || 0}</span>
        </div>
      </div>
    </article>
  );
}
