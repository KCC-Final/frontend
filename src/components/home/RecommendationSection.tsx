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

  const fetchRecommendations = async () => {
    try {
      console.log('=== [추천도서] fetchRecommendations() 호출 ===');

      setIsLoading(true);
      setError(null);

      const recommendationData = await getRecommendations(limit);

      console.log('>>> [백엔드 결과] recommendationData =', recommendationData);

      setRecommendations(recommendationData);

      if (recommendationData.length === 0) {
        console.warn('!!! 추천 데이터가 0개입니다.');
        setIsLoading(false);
        return;
      }

      const isbnList = recommendationData.map((rec) => rec.isbn);
      console.log('>>> [ISBN 리스트] isbnList =', isbnList);

      const books = await getBookDetailsListByIsbn(isbnList);

      console.log('>>> [Aladin 응답] books =', books);

      const sortedBooks = isbnList
        .map((isbn) => books.find((book) => book.isbn13 === isbn))
        .filter((book): book is AladinBookDetailsItem => book !== undefined);

      console.log('>>> [정렬된 Aladin 결과] sortedBooks =', sortedBooks);

      setBookDetails(sortedBooks);
    } catch (err) {
      console.error('추천 도서 조회 실패:', err);
      setError('추천 도서를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

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

  if (error) {
    return (
      <section className={styles.mainBook}>
        <h1>회원님을 위한 추천 도서</h1>
        <div className="text-center text-red-600 py-8">{error}</div>
      </section>
    );
  }

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

  return (
    <section className={styles.mainBook}>
      <h1>회원님을 위한 추천 도서</h1>
      <div className={styles.container}>
        <button
          className={`${styles.navButton} ${styles.left}`}
          onClick={() => scroll('left')}
          aria-label="이전 도서">
          &#8249;
        </button>
        <div className={styles.items} ref={scrollContainerRef}>
          {bookDetails.map((book) => {
            const recommendation = recommendations.find((rec) => rec.isbn === book.isbn13);
            return (
              <div key={book.itemId} className={styles.item}>
                <div className={styles.ranking}>
                  <span className={styles.badge}>{recommendation?.reason || '추천'}</span>
                </div>
                <BookCard
                  isbn={book.isbn13}
                  title={formatBookTitle(book.title)}
                  author={formatBookAuthor(book.author)}
                  cover={book.cover}
                  publisher={book.publisher}
                />
              </div>
            );
          })}
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
};

export default RecommendationSection;
