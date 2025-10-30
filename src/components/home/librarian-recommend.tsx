'use client';

import { useEffect, useRef, useState } from 'react';

import { fetchAladin } from '@/apis/aladin'; // 알라딘 API 래퍼 사용
import BookCard from '@/components/common/book/book-card';
import styles from '@/components/home/main-book.module.scss';
import { LibrarianRecommendBook } from '@/types/nl-library';

interface LibrarianRecommendListProps {
  books: LibrarianRecommendBook[];
}

interface EnhancedBook extends LibrarianRecommendBook {
  aladinTitle?: string;
  aladinAuthor?: string;
  aladinCover?: string;
  aladinPublisher?: string;
}

function LibrarianRecommendList({ books }: LibrarianRecommendListProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [enhancedBooks, setEnhancedBooks] = useState<EnhancedBook[]>(books);

  // recomisbn으로 알라딘 상세정보 가져와서 보강
  useEffect(() => {
    const loadAladinDetails = async () => {
      if (!books || books.length === 0) return;

      try {
        const merged = await Promise.all(
          books.map(async (book) => {
            if (!book.recomisbn) return book;

            try {
              const res = await fetchAladin.getBookDetails(book.recomisbn);
              const item = res.item?.[0];

              if (!item) return book;

              return {
                ...book,
                aladinTitle: item.title || book.recomtitle,
                aladinAuthor: item.author || book.recomauthor,
                aladinCover: item.cover || book.recomfilepath,
                aladinPublisher: item.publisher || ''
              };
            } catch (error) {
              console.warn(`[알라딘 조회 실패: ${book.recomisbn}]`, error);
              return book;
            }
          })
        );

        setEnhancedBooks(merged);
      } catch (err) {
        console.error('[사서추천 → 알라딘 데이터 병합 실패]', err);
      }
    };

    loadAladinDetails();
  }, [books]);

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

  if (!enhancedBooks || enhancedBooks.length === 0) return null;

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
          {enhancedBooks.map((book) => (
            <div key={book.recomNo} className={styles.item}>
              <BookCard
                isbn={book.recomisbn}
                title={book.aladinTitle || book.recomtitle}
                author={book.aladinAuthor || book.recomauthor}
                cover={book.aladinCover || '/images/no-image.png'}
                publisher={book.aladinPublisher || ''}
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
