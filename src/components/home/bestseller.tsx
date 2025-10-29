'use client';

import { useRef } from 'react';

import styles from './main-book.module.scss';

import BookCard from '@/components/common/book/book-card';
import { AladinBestsellerItem } from '@/types/aladin/dto';
import { formatBookAuthor, formatBookTitle } from '@/utils/format/string';

interface BestsellerListProps {
  books: AladinBestsellerItem[];
}

/**
 * 베스트셀러 리스트 컴포넌트
 * @author uyh
 * @param {AladinBestsellerItem[]} books - 베스트셀러 도서 목록
 */
function BestsellerList({ books }: BestsellerListProps) {
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
          {books.map((book, index) => (
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
