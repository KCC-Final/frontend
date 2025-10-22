'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import styles from './my-bookshelf.module.scss';

import type { AladinBookDetailsItem } from '@/types';
import type { BookScrap } from '@/types/bookshelf/bookshelf';

interface BookWithDetails extends BookScrap {
  details?: AladinBookDetailsItem;
}

interface BookCardProps {
  book: BookWithDetails;
}

function BookCard({ book }: BookCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/books/${book.ISBN}`);
  };

  return (
    <div className={styles.book_card} onClick={handleClick}>
      <div className={styles.book_cover}>
        {book.details?.cover ? (
          <Image
            src={book.details.cover}
            alt={book.details.title}
            width={160}
            height={240}
            className={styles.cover_image}
          />
        ) : (
          <div className={styles.no_cover}>도서 이미지</div>
        )}
      </div>

      <div className={styles.book_info}>
        <h4 className={styles.book_title} title={book.details?.title}>
          {book.details?.title || '제목 없음'}
        </h4>
        <p className={styles.book_author} title={book.details?.author}>
          {book.details?.author || '저자 미상'}
        </p>
      </div>
    </div>
  );
}

export default BookCard;
