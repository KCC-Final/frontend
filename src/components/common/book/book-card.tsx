'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import styles from './book-card.module.scss';

interface BookCardProps {
  isbn: string;
  title: string;
  author: string;
  cover: string;
  publisher?: string;
  pubYear?: string;
}

function BookCard({ isbn, title, author, cover, publisher, pubYear }: BookCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/books/${isbn}`);
  };

  return (
    <div className={styles.book_card} onClick={handleClick}>
      <div className={styles.book_cover}>
        {cover ? (
          <Image src={cover} alt={title} width={160} height={240} className={styles.cover_image} />
        ) : (
          <div className={styles.no_cover}>도서 이미지</div>
        )}
      </div>

      <div className={styles.book_info}>
        <h4 className={styles.book_title} title={title}>
          {title || '제목 없음'}
        </h4>
        <p className={styles.book_author} title={author}>
          {author || '저자 미상'}
        </p>
        {publisher && pubYear && (
          <p className={styles.book_meta}>
            {publisher} · {pubYear}
          </p>
        )}
      </div>
    </div>
  );
}

export default BookCard;
