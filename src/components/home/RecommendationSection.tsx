'use client';

import { useEffect, useRef, useState } from 'react';

import { getRecommendations, RecommendationResponse } from '@/apis/groo/recommendation';
import BookCard from '@/components/common/book/book-card';
import styles from '@/components/home/main-book.module.scss';
import { getBookDetailsListByIsbn } from '@/hooks/fetch/home';
import { AladinBookDetailsItem } from '@/types';
import { formatBookAuthor, formatBookTitle } from '@/utils/format/string';

interface RecommendationSectionProps {
  limit?: number;
}

const RecommendationSection: React.FC<RecommendationSectionProps> = ({ limit = 20 }) => {
  const [recommendations, setRecommendations] = useState<RecommendationResponse[]>([]);
  const [bookDetails, setBookDetails] = useState<AladinBookDetailsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchRecommendations();
  }, [limit]);

  /**
   * 추천 ISBN → 알라딘 상세정보 조회 로직
   */
  const fetchRecommendations = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // 1) 추천 ISBN 조회
      const recommendationData = await getRecommendations(limit);
      setRecommendations(recommendationData);

      if (recommendationData.length === 0) {
        setIsLoading(false);
        return;
      }

      // 2) ISBN 리스트 뽑기
      const isbnList = recommendationData.map((rec) => rec.isbn);

      // 3) 알라딘 API 상세정보 조회
      const books = await getBookDetailsListByIsbn(isbnList);

      // 4) 응답 순서 보장 X → ISBN 순서대로 재정렬
      const sortedBooks = isbnList
        .map((isbn) => books.find((book) => book.isbn13 === isbn))
        .filter((book): book is AladinBookDetailsItem => book !== undefined);

      setBookDetails(sortedBooks);
    } catch (err) {
      console.error('추천 도서 조회 실패:', err);
      setError('추천 도서를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 좌/우 스크롤
   */
  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      const next =
        direction === 'left'
          ? scrollContainerRef.current.scrollLeft - scrollAmount
          : scrollContainerRef.current.scrollLeft + scrollAmount;

      scrollContainerRef.current.scrollTo({
        left: next,
        behavior: 'smooth'
      });
    }
  };

  /**
   * 로딩 상태
   */
  if (isLoading) {
    return (
      <section className={styles.mainBook}>
        <h1>회원님을 위한 추천 도서</h1>
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <span className="ml-3 text-gray-600">추천 도서를 찾고 있습니다...</span>
        </div>
      </section>
    );
  }

  /**
   * 에러 상태
   */
  if (error) {
    return (
      <section className={styles.mainBook}>
        <h1>회원님을 위한 추천 도서</h1>
        <div className="text-center text-red-600 py-8">{error}</div>
      </section>
    );
  }

  /**
   * 결과 없음
   */
  if (bookDetails.length === 0) {
    return (
      <section className={styles.mainBook}>
        <h1>회원님을 위한 추천 도서</h1>
        <div className="text-center text-gray-600 py-8">
          추천할 도서가 없습니다. 더 많은 책을 읽고 리뷰를 작성해보세요!
        </div>
      </section>
    );
  }

  /**
   * 정상 렌더링
   */
  return (
    <section className={styles.mainBook}>
      <h1>회원님을 위한 추천 도서</h1>

      <div className={styles.container}>
        {/* 왼쪽 이동 버튼 */}
        <button
          className={`${styles.navButton} ${styles.left}`}
          onClick={() => scroll('left')}
          aria-label="이전 도서">
          &#8249;
        </button>

        {/* 도서 리스트 */}
        <div className={styles.items} ref={scrollContainerRef}>
          {bookDetails.map((book, index) => (
            <div key={book.itemId} className={styles.item}>
              {/* 순위 배지 (PopularBooks 방식) */}
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
};

export default RecommendationSection;
