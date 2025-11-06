'use client';

import { useEffect, useRef } from 'react';

import BookCard from '@/components/common/book/book-card';
import styles from '@/components/home/main-book.module.scss';
import { useHomeStore } from '@/stores/home';

function LibrarianRecommendList() {
  const { librarianRecommendData, fetchLibrarianRecommendData } = useHomeStore();

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchLibrarianRecommendData();
  }, [fetchLibrarianRecommendData]);

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

  // if (!librarianRecommendData || librarianRecommendData.length === 0) return null;

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
          {librarianRecommendData.map((book) => (
            <div key={book.isbn13} className={styles.item}>
              <BookCard
                isbn={book.isbn13}
                title={book.title}
                author={book.author}
                cover={book.cover}
                publisher={book.publisher}
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
