'use client';

import { PenSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';

import styles from './review-feed.module.scss';

import { fetchGroo } from '@/apis/groo';
import ReviewCard from '@/components/reviews/commons/review-card';
import { ReviewData } from '@/types/reviews';
import { getReviewErrorMessage } from '@/utils/error/review-error-handler';

export default function ReviewFeed() {
  const router = useRouter();
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [visibleReviews, setVisibleReviews] = useState<ReviewData[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [filter, setFilter] = useState<'latest' | 'popular' | 'following'>('latest');
  const [mounted, setMounted] = useState(false);

  const loaderRef = useRef<HTMLDivElement | null>(null);
  const ITEMS_PER_PAGE = 15; // 3개씩 5줄

  useEffect(() => {
    setMounted(true);
    loadReviews('latest');
  }, []);

  const loadReviews = async (filterType: 'latest' | 'popular' | 'following') => {
    try {
      setLoading(true);
      setError('');
      let response;

      if (filterType === 'popular') {
        response = await fetchGroo.review.getAllReviewsOrderByLikes();
      } else if (filterType === 'following') {
        response = await fetchGroo.review.getReviewsByFollowing();
      } else {
        response = await fetchGroo.review.getAllReviews();
      }

      let reviewsData = Array.isArray(response) ? response : response.data || [];
      reviewsData = reviewsData.filter((review: ReviewData) => !review.secret);

      setReviews(reviewsData);
      setVisibleReviews(reviewsData.slice(0, ITEMS_PER_PAGE));
      setPage(1);
    } catch (error: any) {
      const errorMessage = getReviewErrorMessage(error);
      setError(errorMessage);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilter: 'latest' | 'popular' | 'following') => {
    setFilter(newFilter);
    loadReviews(newFilter);
  };

  const handleWriteReview = () => {
    router.push('/reviews/write?from=/reviews/feed');
  };

  const handleReviewClick = (reviewId: number) => {
    router.push(`/reviews/${reviewId}`);
  };

  // IntersectionObserver로 무한 스크롤 구현
  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && !loading) {
          const nextPage = page + 1;
          const start = nextPage * ITEMS_PER_PAGE;
          const end = start + ITEMS_PER_PAGE;
          const nextItems = reviews.slice(start, end);

          if (nextItems.length > 0) {
            setVisibleReviews((prev) => [...prev, ...nextItems]);
            setPage(nextPage);
          }
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(loaderRef.current);

    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [reviews, page, loading]);

  if (!mounted || loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>{error}</div>
        <button onClick={() => loadReviews(filter)} className={styles.retryButton}>
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>독서 피드</h1>
        <button className={styles.writeButton} onClick={handleWriteReview}>
          <PenSquare size={20} />
          <span>독후감 작성</span>
        </button>
      </header>

      <nav className={styles.filterNav}>
        <button
          className={`${styles.filterButton} ${filter === 'latest' ? styles.active : ''}`}
          onClick={() => handleFilterChange('latest')}>
          최신순
        </button>
        <button
          className={`${styles.filterButton} ${filter === 'popular' ? styles.active : ''}`}
          onClick={() => handleFilterChange('popular')}>
          인기순
        </button>
        <button
          className={`${styles.filterButton} ${filter === 'following' ? styles.active : ''}`}
          onClick={() => handleFilterChange('following')}>
          팔로잉
        </button>
      </nav>

      <div className={styles.feedGrid}>
        {visibleReviews.map((review) => (
          <ReviewCard
            key={review.reviewId}
            review={review}
            onClick={handleReviewClick}
            showSecretBadge={false}
          />
        ))}
      </div>

      {/* 로딩 트리거용 div */}
      <div ref={loaderRef} style={{ height: '60px' }} />

      {visibleReviews.length === 0 && (
        <div className={styles.empty}>
          {filter === 'following' ? (
            <>
              <p>팔로잉한 유저가 없습니다.</p>
              <button className={styles.emptyButton} onClick={() => handleFilterChange('latest')}>
                전체 피드 보기
              </button>
            </>
          ) : (
            <>
              <p>아직 작성된 독후감이 없습니다.</p>
              <button className={styles.emptyButton} onClick={handleWriteReview}>
                첫 독후감 작성하기
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
