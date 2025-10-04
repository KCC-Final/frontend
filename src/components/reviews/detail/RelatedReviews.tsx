/**
 * @author CI/CD 담당자
 * @created 2025-10-04
 * 관련 독후감 섹션 (같은 도서 / 같은 카테고리)
 */
'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

import RelatedReviewCard from './RelatedReviewCard';
import styles from './RelatedReviews.module.scss';

import { fetchGroo } from '@/apis/groo';
import { ReviewData } from '@/types/reviews';

type Props = {
  isbn: string;
  category: string;
  currentReviewId: number;
};

export default function RelatedReviews({ isbn, category, currentReviewId }: Props) {
  const [activeTab, setActiveTab] = useState<'isbn' | 'category'>('isbn');
  const [isbnReviews, setIsbnReviews] = useState<ReviewData[]>([]);
  const [categoryReviews, setCategoryReviews] = useState<ReviewData[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadRelatedReviews();
  }, [isbn, category]);

  const loadRelatedReviews = async () => {
    try {
      setLoading(true);

      // 같은 ISBN의 독후감 조회
      const isbnData = await fetchGroo.review.getReviewsByIsbn(isbn);
      // 현재 독후감 제외
      setIsbnReviews(isbnData.filter((r: ReviewData) => r.reviewId !== currentReviewId));

      // 같은 카테고리의 독후감 조회
      const categoryData = await fetchGroo.review.getReviewsByCategory(category, 20);
      // 현재 독후감 제외
      setCategoryReviews(categoryData.filter((r: ReviewData) => r.reviewId !== currentReviewId));
    } catch (error) {
      console.error('관련 독후감 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const currentReviews = activeTab === 'isbn' ? isbnReviews : categoryReviews;

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>관련 독후감을 불러오는 중...</div>
      </div>
    );
  }

  // 둘 다 없으면 섹션 자체를 렌더링하지 않음
  if (isbnReviews.length === 0 && categoryReviews.length === 0) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>관련 독후감</h2>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'isbn' ? styles.active : ''}`}
            onClick={() => setActiveTab('isbn')}
            disabled={isbnReviews.length === 0}>
            같은 도서 ({isbnReviews.length})
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'category' ? styles.active : ''}`}
            onClick={() => setActiveTab('category')}
            disabled={categoryReviews.length === 0}>
            같은 카테고리 ({categoryReviews.length})
          </button>
        </div>
      </div>

      {currentReviews.length === 0 ? (
        <div className={styles.empty}>
          {activeTab === 'isbn'
            ? '같은 도서의 다른 독후감이 없습니다.'
            : '같은 카테고리의 다른 독후감이 없습니다.'}
        </div>
      ) : (
        <div className={styles.scrollContainer}>
          {currentReviews.length > 3 && (
            <button
              className={`${styles.scrollButton} ${styles.left}`}
              onClick={() => scroll('left')}
              aria-label="왼쪽으로 스크롤">
              <ChevronLeft size={24} />
            </button>
          )}

          <div className={styles.reviewList} ref={scrollRef}>
            {currentReviews.map((review) => (
              <RelatedReviewCard key={review.reviewId} review={review} />
            ))}
          </div>

          {currentReviews.length > 3 && (
            <button
              className={`${styles.scrollButton} ${styles.right}`}
              onClick={() => scroll('right')}
              aria-label="오른쪽으로 스크롤">
              <ChevronRight size={24} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
