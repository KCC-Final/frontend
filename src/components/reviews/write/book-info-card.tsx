'use client';

import styles from '@/components/reviews/write/book-info-card.module.scss';
import { AladinBook } from '@/types/reviews';

interface BookInfoCardProps {
  book: AladinBook;
  onRemove: () => void;
}

function BookInfoCard({ book, onRemove }: BookInfoCardProps) {
  return (
    <div className={styles.bookCard}>
      <div className={styles.bookImage}>
        <img
          src={book.cover}
          alt={book.title}
          className={styles.cover}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/images/default-book-cover.png'; // 기본 이미지 경로
          }}
        />
      </div>

      <div className={styles.bookInfo}>
        <div className={styles.bookDetails}>
          <h3 className={styles.title}>{book.title}</h3>
          <p className={styles.author}>{book.author}</p>
          <p className={styles.publisher}>
            {book.publisher} | {book.pubDate}
          </p>
          <p className={styles.isbn}>ISBN: {book.isbn13}</p>
          {book.categoryName && <p className={styles.category}>분야: {book.categoryName}</p>}
          {book.description && (
            <p className={styles.description}>
              {book.description.length > 150 ? `${book.description.substring(0, 150)}...` : book.description}
            </p>
          )}
        </div>

        <div className={styles.bookActions}>
          <button onClick={onRemove} className={styles.removeButton} aria-label="선택된 도서 제거">
            다른 도서 선택
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookInfoCard;
