'use client';

import { PenSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import styles from './review-feed.module.scss';

import { fetchGroo } from '@/apis/groo';
import ReviewCard from '@/components/reviews/commons/review-card';
import { ReviewData } from '@/types/reviews';
import { getReviewErrorMessage } from '@/utils/error/review-error-handler';

export default function ReviewFeed() {
  const router = useRouter();
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [filter, setFilter] = useState<'latest' | 'popular' | 'following'>('latest');
  const [mounted, setMounted] = useState(false);

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
        try {
          response = await fetchGroo.review.getAllReviewsOrderByLikes();
        } catch {
          response = await fetchGroo.review.getAllReviews();
        }
      } else if (filterType === 'following') {
        try {
          response = await fetchGroo.review.getReviewsByFollowing();
        } catch {
          response = await fetchGroo.review.getAllReviews();
        }
      } else {
        response = await fetchGroo.review.getAllReviews();
      }

      let reviewsData = Array.isArray(response) ? response : response.data || [];
      reviewsData = reviewsData.filter((review: ReviewData) => !review.secret);

      setReviews(reviewsData);
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

      {/*  탭은 항상 표시 */}
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

      {/*  피드 목록 */}
      <div className={styles.feedGrid}>
        {reviews && reviews.length > 0
          ? reviews.map((review) => (
              <ReviewCard
                key={review.reviewId}
                review={review}
                onClick={handleReviewClick}
                showSecretBadge={false}
              />
            ))
          : null}
      </div>

      {/*  빈 상태 표시 (탭 아래로 이동) */}
      {(!reviews || reviews.length === 0) && (
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
