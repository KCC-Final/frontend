'use client';

import { useRef } from 'react';

import BookCard from '@/components/common/book/book-card';
import styles from '@/components/home/main-book.module.scss';
import { LibrarianRecommendBook } from '@/types/nl-library';

/**
 * 사서 추천 도서 리스트 (BestsellerList 스타일 적용)
 */
interface LibrarianRecommendListProps {
  books: LibrarianRecommendBook[];
}

function LibrarianRecommendList({ books }: LibrarianRecommendListProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 400;
    const newScrollPosition =
      direction === 'left'
        ? scrollContainerRef.current.scrollLeft - scrollAmount
        : scrollContainerRef.current.scrollLeft + scrollAmount;
    scrollContainerRef.current.scrollTo({
      left: newScrollPosition,
      behavior: 'smooth'
    });
  };

  if (!books || books.length === 0) return null;

  return (
    <section className={styles.mainBook}>
      <h1>사서 추천 도서</h1>
      <div className={styles.container}>
        <button
          className={`${styles.navButton} ${styles.left}`}
          onClick={() => scroll('left')}
          aria-label="이전 도서">
          &#8249;
        </button>

        <div className={styles.items} ref={scrollContainerRef}>
          {books.map((book) => (
            <div key={book.recomNo} className={styles.item}>
              <div className={styles.ranking}>
                <span className={styles.badge}>{book.drCodeName}</span>
              </div>
              <BookCard
                isbn={book.recomisbn}
                title={book.recomtitle}
                author={book.recomauthor}
                cover={book.recomfilepath || '/images/no-image.png'}
                publisher=""
              />
            </div>
          ))}
        </div>

        <button
          className={`${styles.navButton} ${styles.right}`}
          onClick={() => scroll('right')}
          aria-label="다음 도서">
          &#8250;
        </button>
      </div>
    </section>
  );
}

export default LibrarianRecommendList;
