'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

import styles from './RelatedReviewCard.module.scss';

import { fetchAladin } from '@/apis';
import { ReviewData } from '@/types/reviews';

type Props = {
  review: ReviewData;
};

export default function RelatedReviewCard({ review }: Props) {
  const router = useRouter();
  const [bookCover, setBookCover] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookCover = async () => {
      try {
        const data = await fetchAladin.getBookDetails(review.isbn);
        if (data.item && data.item[0] && data.item[0].cover) {
          setBookCover(data.item[0].cover);
        }
      } catch (error) {
        console.error('책 표지 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    if (review.isbn) {
      fetchBookCover();
    }
  }, [review.isbn]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleClick = () => {
    router.push(`/reviews/${review.reviewId}`);
  };

  return (
    <article className={styles.card} onClick={handleClick}>
      <div className={styles.coverSection}>
        {loading ? (
          <div className={styles.coverLoading}>로딩...</div>
        ) : bookCover ? (
          <>
            <div className={styles.blurBackground} style={{ backgroundImage: `url(${bookCover})` }} />
            <img src={bookCover} alt={review.reviewTitle} className={styles.bookCover} />
          </>
        ) : (
          <div className={styles.noCover}>표지 없음</div>
        )}
      </div>

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
