'use client';

import styles from '@/components/reviews/write/book-info-card.module.scss';
import { AladinBook, LibraryBook } from '@/types/reviews';

interface BookInfoCardProps {
  book: AladinBook;
  libraryBook: LibraryBook | null;
  onRemove: () => void;
}

function BookInfoCard({ book, libraryBook, onRemove }: BookInfoCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.content}>
        <img src={book.cover} alt={book.title} className={styles.cover} />
        <div className={styles.info}>
          <h3 className={styles.title}>{book.title}</h3>
          <p className={styles.author}>{book.author}</p>
          <p className={styles.publisher}>
            {book.publisher} | {book.pubDate}
          </p>
          <p className={styles.isbn}>ISBN: {book.isbn13}</p>

          {libraryBook && (
            <div className={styles.category}>
              <span className={styles.categoryLabel}>분류:</span>
              <span className={styles.categoryValue}>
                {libraryBook.class_nm} ({libraryBook.class_no})
              </span>
            </div>
          )}
        </div>
      </div>

      <button onClick={onRemove} className={styles.removeButton}>
        도서 변경
      </button>
    </div>
  );
}

export default BookInfoCard;
