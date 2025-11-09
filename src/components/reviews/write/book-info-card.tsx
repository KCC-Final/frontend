'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import styles from './book-info-card.module.scss';

import { AladinBook } from '@/types/reviews/book-search';

type Props = {
  bookInfo: AladinBook | null;
  loading: boolean;
  onEdit?: () => void;
  readOnly?: boolean;
};

export default function BookInfo({ bookInfo, loading, onEdit, readOnly = false }: Props) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

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

  const handleBookClick = () => {
    if (!readOnly && onEdit) {
      return;
    }
    router.push(`/books/${bookInfo.isbn13}`);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit();
    }
  };

  return (
    <div className={styles.container}>
      <div
        className={`${styles.bookCard} ${!readOnly && onEdit ? styles.editable : ''}`}
        onClick={handleBookClick}
        onMouseEnter={() => !readOnly && onEdit && setIsHovered(true)}
        onMouseLeave={() => !readOnly && onEdit && setIsHovered(false)}>
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
        </div>

        {!readOnly && onEdit && isHovered && (
          <div className={styles.editOverlay} onClick={handleEditClick}>
            <div className={styles.editIcon}>
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              <span className={styles.editText}>도서 변경</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
