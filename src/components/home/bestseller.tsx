'use client';

import { useRef } from 'react';

import BookCard from '@/components/common/book/book-card';
import styles from '@/components/home/main-book.module.scss';
import { useHomeStore } from '@/stores/home';
import { formatBookAuthor, formatBookTitle } from '@/utils/format/string';

function BestsellerList() {
  const { bestSellerData } = useHomeStore();

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      const newScrollPosition =
        direction === 'left'
          ? scrollContainerRef.current.scrollLeft - scrollAmount
          : scrollContainerRef.current.scrollLeft + scrollAmount;

      scrollContainerRef.current.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className={styles.mainBook}>
      <h1>베스트셀러</h1>
      <div className={styles.container}>
        <button
          className={`${styles.navButton} ${styles.left}`}
          onClick={() => scroll('left')}
          aria-label="이전 도서">
          &#8249;
        </button>
        <div className={styles.items} ref={scrollContainerRef}>
          {bestSellerData.map((book, index) => (
            <div key={book.itemId} className={styles.item}>
              <div className={styles.ranking}>
                <span className={index < 3 ? styles.top3 : styles.normal}>{book.bestRank}</span>
              </div>
              <BookCard
                isbn={book.isbn13}
                title={formatBookTitle(book.title)}
                author={formatBookAuthor(book.author)}
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

export default BestsellerList;
