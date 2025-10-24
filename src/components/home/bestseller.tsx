'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';

import styles from '@/components/home/home.module.scss';
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
    <section className={styles.bestseller}>
      <h1>베스트셀러</h1>
      <div className={styles.container}>
        <button
          className={`${styles.navButton} ${styles.left}`}
          onClick={() => scroll('left')}
          aria-label="이전 도서">
          &#8249;
        </button>
        <div className={styles.items} ref={scrollContainerRef}>
          {books.map((book) => (
            <div key={book.itemId} className={styles.item}>
              <Link href={`/books/${book.isbn13}`}>
                <div className={styles.cover}>
                  <Image src={book.cover} alt={book.title} fill sizes="180px" />
                  <span className={styles.rank}>{book.bestRank}</span>
                </div>
                <div className={styles.info}>
                  <div className={styles.title}>{formatBookTitle(book.title)}</div>
                  <div className={styles.author}>{formatBookAuthor(book.author)}</div>
                </div>
              </Link>
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
