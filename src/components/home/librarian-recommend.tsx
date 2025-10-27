'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';

import styles from '@/components/home/home.module.scss';
import { LibrarianRecommendBook } from '@/types/nl-library';

interface LibrarianRecommendListProps {
  books: LibrarianRecommendBook[];
}

function LibrarianRecommendList({ books }: LibrarianRecommendListProps) {
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
    <section className={styles.librarianRecommend}>
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
              <Link href={`/books/${book.recomisbn}`}>
                <div className={styles.cover}>
                  {book.recomfilepath ? (
                    <Image
                      src={book.recomfilepath}
                      alt={book.recomtitle}
                      fill
                      sizes="180px"
                      onError={(e) => {
                        e.currentTarget.src = '/images/no-image.png';
                      }}
                    />
                  ) : (
                    <div className={styles.noImage}>이미지 없음</div>
                  )}
                  <span className={styles.badge}>사서추천</span>
                </div>
                <div className={styles.info}>
                  <div className={styles.category}>{book.drCodeName}</div>
                  <div className={styles.title}>{book.recomtitle}</div>
                  <div className={styles.author}>{book.recomauthor}</div>
                  <div className={styles.date}>
                    {book.recomYear}년 {book.recomMonth}월
                  </div>
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

export default LibrarianRecommendList;
