'use client';

import { format } from 'date-fns';
import { useEffect, useState, useRef } from 'react';

import { fetchAladin } from '@/apis/aladin'; // 알라딘 API 추가
import { fetchLibrary } from '@/apis/library';
import BookCard from '@/components/common/book/book-card';
import styles from '@/components/home/main-book.module.scss';

interface TrendDoc {
  isbn13: string;
  bookname: string;
  authors: string;
  publisher?: string;
  publication_year?: string;
  bookImageURL?: string;
}

export default function HotTrendBooks() {
  const [books, setBooks] = useState<TrendDoc[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const today = format(new Date(), 'yyyy-MM-dd');
        const response = await fetchLibrary.getHotTrendBooks(today);
        const results = response?.response?.results;

        if (!Array.isArray(results)) return;

        const seen = new Set<string>();
        const all: TrendDoc[] = [];

        // 1️ 정보나루 결과에서 ISBN13 추출
        for (const r of results) {
          const docs = r?.result?.docs ?? [];
          for (const d of docs) {
            const doc: TrendDoc | undefined = d?.doc;
            if (!doc?.isbn13 || seen.has(doc.isbn13)) continue;
            seen.add(doc.isbn13);
            all.push(doc);
          }
        }

        // 2️ 알라딘 상세 정보 병합
        const enriched = await Promise.all(
          all.slice(0, 12).map(async (book) => {
            try {
              const aladinRes = await fetchAladin.getBookDetails(book.isbn13); // 재사용
              const aladinItem = aladinRes?.item?.[0];
              if (!aladinItem) return book;

              return {
                ...book,
                bookname: aladinItem.title || book.bookname,
                authors: aladinItem.author || book.authors,
                publisher: aladinItem.publisher || book.publisher,
                bookImageURL: aladinItem.cover || book.bookImageURL
              };
            } catch (error) {
              console.warn(`[알라딘 조회 실패: ${book.isbn13}]`, error);
              return book;
            }
          })
        );

        setBooks(enriched);
      } catch (err) {
        console.error('대출 급상승 도서를 불러오는 중 오류:', err);
      }
    };

    loadBooks();
  }, []);

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

  if (books.length === 0) return null;

  return (
    <section className={styles.mainBook}>
      <h1>대출 급상승 도서</h1>
      <div className={styles.container}>
        <button
          className={`${styles.navButton} ${styles.left}`}
          onClick={() => scroll('left')}
          aria-label="이전 도서">
          &#8249;
        </button>

        <div className={styles.items} ref={scrollContainerRef}>
          {books.map((book, index) => (
            <div key={book.isbn13} className={styles.item}>
              <div className={styles.ranking}>
                <span className={index < 3 ? styles.top3 : styles.normal}>{index + 1}</span>
              </div>
              <BookCard
                isbn={book.isbn13}
                title={book.bookname}
                author={book.authors}
                cover={book.bookImageURL || '/images/no-image.png'}
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
