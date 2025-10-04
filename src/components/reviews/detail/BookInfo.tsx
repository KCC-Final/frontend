'use client';

import styles from './BookInfo.module.scss';

import { AladinBook } from '@/types/reviews/book-search';

type Props = {
  bookInfo: AladinBook | null;
  loading: boolean;
};

export default function BookInfo({ bookInfo, loading }: Props) {
  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>도서 정보를 불러오는 중...</div>
      </div>
    );
  }

  if (!bookInfo) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>도서 정보를 찾을 수 없습니다.</div>
      </div>
    );
  }

  const rating = bookInfo.customerReviewRank ? bookInfo.customerReviewRank / 2 : 0;

  return (
    <div className={styles.container}>
      <div className={styles.bookCard}>
        <div className={styles.coverSection}>
          <img
            src={bookInfo.cover}
            alt={bookInfo.title}
            className={styles.bookCover}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/images/default-book-cover.png';
            }}
          />
        </div>

        <div className={styles.infoSection}>
          <div className={styles.header}>
            <h2 className={styles.category}>{bookInfo.categoryName}</h2>
            <h1 className={styles.title}>{bookInfo.title}</h1>
          </div>

          <div className={styles.metadata}>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>저자</span>
              <span className={styles.metaValue}>{bookInfo.author}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>출판사</span>
              <span className={styles.metaValue}>{bookInfo.publisher}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>출간일</span>
              <span className={styles.metaValue}>{bookInfo.pubDate}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>ISBN</span>
              <span className={styles.metaValue}>{bookInfo.isbn13}</span>
            </div>
          </div>

          {bookInfo.customerReviewRank > 0 && (
            <div className={styles.rating}>
              <div className={styles.stars}>
                {Array.from({ length: 5 }, (_, index) => {
                  const starValue = index + 1;
                  return (
                    <span
                      key={index}
                      className={
                        starValue <= Math.floor(rating)
                          ? styles.starFilled
                          : starValue - 0.5 <= rating
                            ? styles.starHalf
                            : styles.starEmpty
                      }>
                      ★
                    </span>
                  );
                })}
              </div>
              <span className={styles.ratingValue}>{rating.toFixed(1)}</span>
            </div>
          )}

          {bookInfo.description && (
            <div className={styles.description}>
              <p>{bookInfo.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
