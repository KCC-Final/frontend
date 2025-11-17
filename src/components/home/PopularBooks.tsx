'use client';

import { useEffect, useRef, useState } from 'react';

import { getPopularBooks } from '@/apis/groo/recommendation';
import BookCard from '@/components/common/book/book-card';
import styles from '@/components/home/main-book.module.scss';
import { getBookDetailsListByIsbn } from '@/hooks/fetch/home';
import { AladinBookDetailsItem } from '@/types';
import { formatBookAuthor, formatBookTitle } from '@/utils/format/string';

function PopularBooks() {
  // 알라딘 상세정보 데이터 상태
  const [bookDetails, setBookDetails] = useState<AladinBookDetailsItem[]>([]);
  const [loading, setLoading] = useState(true);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchPopularBooks();
  }, []);

  /**
   * 인기 도서 조회 → ISBN 리스트 → 알라딘 API 상세조회
   */
  const fetchPopularBooks = async () => {
    try {
      setLoading(true);

      // 1) 인기 도서 ISBN 리스트 조회
      const popularList = await getPopularBooks(20);

      if (!popularList || popularList.length === 0) {
        setBookDetails([]);
        return;
      }

      // 2) ISBN 리스트 추출
      const isbnList = popularList.map((rec) => rec.isbn);

      // 3) 알라딘 상세정보 API 호출
      const books = await getBookDetailsListByIsbn(isbnList);

      // 4) ISBN 순서에 맞게 정렬 (API 응답은 순서 보장 X)
      const sortedBooks = isbnList
        .map((isbn) => books.find((book) => book.isbn13 === isbn))
        .filter((book): book is AladinBookDetailsItem => book !== undefined);

      setBookDetails(sortedBooks);
    } catch (error) {
      console.error('인기 도서 상세조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 좌우 스크롤 이동
   */
  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 400;

    const next =
      direction === 'left'
        ? scrollContainerRef.current.scrollLeft - scrollAmount
        : scrollContainerRef.current.scrollLeft + scrollAmount;

    scrollContainerRef.current.scrollTo({
      left: next,
      behavior: 'smooth'
    });
  };

  // 로딩 스켈레톤
  if (loading) {
    return (
      <section className={styles.mainBook}>
        <h1>지금 인기있는 도서</h1>
        <div className={styles.container}>
          <div className={styles.items}>
            {[...Array(5)].map((_, index) => (
              <div key={index} className={styles.item}>
                <div className={styles.skeleton}></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!bookDetails || bookDetails.length === 0) return null;

  return (
    <section className={styles.mainBook}>
      <h1>지금 인기있는 도서</h1>
      <div className={styles.container}>
        {/* 왼쪽 이동 버튼 */}
        <button
          className={`${styles.navButton} ${styles.left}`}
          onClick={() => scroll('left')}
          aria-label="이전 도서">
          &#8249;
        </button>

        {/* 도서 목록 */}
        <div className={styles.items} ref={scrollContainerRef}>
          {bookDetails.map((book, index) => (
            <div key={book.isbn13} className={styles.item}>
              {/* 순위 표시 */}
              <div className={styles.ranking}>
                <span className={index < 3 ? styles.top3 : styles.normal}>{index + 1}</span>
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

        {/* 오른쪽 이동 버튼 */}
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

export default PopularBooks;
