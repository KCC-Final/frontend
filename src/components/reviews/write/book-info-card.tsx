'use client';

import Image from 'next/image';

import styles from '@/components/reviews/write/book-info-card.module.scss';
import { AladinBook } from '@/types/reviews';
import { formatBookAuthor, formatBookTitle } from '@/utils/format/string';

interface BookInfoCardProps {
  book: AladinBook;
  onRemove: () => void;
  readOnly?: boolean;
}

function BookInfoCard({ book, onRemove, readOnly = false }: BookInfoCardProps) {
  const ratingPercentage = (book.customerReviewRank / 10) * 100;

  return (
    <div className={styles.book_card}>
      <div
        className={styles.cover}
        style={{ '--background-image': `url(${book.cover})` } as React.CSSProperties}>
        <Image
          className={styles.img}
          src={book.cover}
          alt={book.title}
          width={200}
          height={300}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/images/default-book-cover.png';
          }}
        />
      </div>
      <div className={styles.info}>
        <div className={styles.header}>
          <div className={styles.category}>{book.categoryName || '분류 없음'}</div>
          <div className={styles.title}>{formatBookTitle(book.title)}</div>
        </div>
        <div className={styles.content}>
          <div className={styles.book_details}>
            <div className={styles.detail_row}>
              <span className={styles.label}>저자</span>
              <span className={styles.value}>{formatBookAuthor(book.author)}</span>
            </div>
            <div className={styles.detail_row}>
              <span className={styles.label}>출간일</span>
              <span className={styles.value}>{book.pubDate}</span>
            </div>
            <div className={styles.detail_row}>
              <span className={styles.label}>평점</span>
              <div className={styles.rating_display}>
                <div className={styles.stars}>
                  <div className={styles.background}>★★★★★</div>
                  <div className={styles.fill} style={{ width: `${ratingPercentage}%` }}>
                    ★★★★★
                  </div>
                </div>
                <span className={styles.score_text}>{(book.customerReviewRank / 2).toFixed(1)}</span>
              </div>
            </div>
          </div>
        </div>
        <span className={styles.divider} />
        {book.description && (
          <div className={styles.description}>
            <span className={styles.desc_label}>책소개</span>
            <p className={styles.desc_text}>
              {book.description.length > 200 ? `${book.description.substring(0, 200)}...` : book.description}
            </p>
          </div>
        )}
        {!readOnly && (
          <div className={styles.actions}>
            <button onClick={onRemove} className={styles.change_button}>
              다른 도서 선택
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default BookInfoCard;
