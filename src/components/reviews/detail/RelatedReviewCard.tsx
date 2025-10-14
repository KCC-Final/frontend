'use client';

import { useRouter } from 'next/navigation';

import styles from './RelatedReviewCard.module.scss';

import BookCover from '@/components/reviews/commons/book-cover';
import { ReviewData } from '@/types/reviews';

type Props = {
  review: ReviewData;
};

export default function RelatedReviewCard({ review }: Props) {
  const router = useRouter();

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const handleClick = () => {
    router.push(`/reviews/${review.reviewId}`);
  };

  return (
    <article className={styles.card} onClick={handleClick}>
      <BookCover
        isbn={review.isbn}
        title={review.reviewTitle}
        className={styles.coverSection}
        noImageClassName={styles.noCover}
      />

      <div className={styles.content}>
        <h3 className={styles.title}>{review.reviewTitle}</h3>

        <div className={styles.author}>
          <span className={styles.authorName}>{review.userId}</span>
          <span className={styles.date}>{formatDate(review.createdAt)}</span>
        </div>

        <p className={styles.excerpt}>{review.reviewContent?.replace(/<[^>]*>/g, '').substring(0, 80)}...</p>

        <div className={styles.stats}>
          <span className={styles.stat}>♥ {review.likeCount || 0}</span>
          <span className={styles.stat}>💬 {review.commentCount || 0}</span>
        </div>
      </div>
    </article>
  );
}
