'use client';

import clsx from 'clsx';
import { PenSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';

import { fetchGroo } from '@/apis';
import BasicButton from '@/components/common/button/basic';
import PageLoading from '@/components/common/loading';
import ReviewCard from '@/components/common/review-card';
import styles from '@/components/reviews/feed/feed.module.scss';
import { ReviewData } from '@/types';
import { getReviewErrorMessage } from '@/utils/error/review-error-handler';

function ReviewFeed() {
  const router = useRouter();
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [filter, setFilter] = useState<'latest' | 'popular' | 'following'>('latest');
  const [mounted, setMounted] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const loaderRef = useRef<HTMLDivElement | null>(null);
  const ITEMS_PER_PAGE = 16;

  useEffect(() => {
    setMounted(true);
    loadInitialReviews('latest');
  }, []);

  // 처음 로드
  const loadInitialReviews = async (filterType: 'latest' | 'popular' | 'following') => {
    try {
      setLoading(true);
      setError('');
      let reviewsData: ReviewData[] = [];

      if (filterType === 'popular') {
        // TODO: 백엔드에 popular/cursor 엔드포인트 추가되면 사용
        // reviewsData = await fetchGroo.review.getAllReviewsOrderByLikesWithCursor(undefined, ITEMS_PER_PAGE);
        const response = await fetchGroo.review.getAllReviewsOrderByLikes();
        reviewsData = (Array.isArray(response) ? response : response.data || []).slice(0, ITEMS_PER_PAGE);
      } else if (filterType === 'following') {
        // TODO: 백엔드에 following/cursor 엔드포인트 추가되면 사용
        // reviewsData = await fetchGroo.review.getReviewsByFollowingWithCursor(undefined, ITEMS_PER_PAGE);
        const response = await fetchGroo.review.getReviewsByFollowing();
        reviewsData = (Array.isArray(response) ? response : response.data || []).slice(0, ITEMS_PER_PAGE);
      } else {
        // latest는 커서 방식 사용
        reviewsData = await fetchGroo.review.getAllReviewsWithCursor(undefined, ITEMS_PER_PAGE);
      }

      reviewsData = reviewsData.filter((review: ReviewData) => !review.secret);

      setReviews(reviewsData);
      setHasMore(reviewsData.length === ITEMS_PER_PAGE);
    } catch (error: any) {
      const errorMessage = getReviewErrorMessage(error);
      setError(errorMessage);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  // 추가 로드 (무한 스크롤)
  const loadMoreReviews = async () => {
    if (!hasMore || isLoadingMore || reviews.length === 0) return;

    try {
      setIsLoadingMore(true);
      const lastReviewId = reviews[reviews.length - 1].reviewId;
      let newReviews: ReviewData[] = [];

      if (filter === 'popular') {
        // TODO: 백엔드에 popular/cursor 엔드포인트 추가되면 사용
        return;
      } else if (filter === 'following') {
        // TODO: 백엔드에 following/cursor 엔드포인트 추가되면 사용
        return;
      } else {
        // latest는 커서 방식 사용
        newReviews = await fetchGroo.review.getAllReviewsWithCursor(lastReviewId, ITEMS_PER_PAGE);
      }

      newReviews = newReviews.filter((review: ReviewData) => !review.secret);

      if (newReviews.length > 0) {
        setReviews((prev) => [...prev, ...newReviews]);
        setHasMore(newReviews.length === ITEMS_PER_PAGE);
      } else {
        setHasMore(false);
      }
    } catch (error: any) {
      console.error('Failed to load more reviews:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const filterHandler = (newFilter: 'latest' | 'popular' | 'following') => () => {
    setFilter(newFilter);
    setReviews([]);
    setHasMore(true);
    loadInitialReviews(newFilter);
  };

  const writeReviewHandler = () => {
    router.push('/reviews/write?from=/reviews/feed');
  };

  // IntersectionObserver로 무한 스크롤
  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !isLoadingMore) {
          loadMoreReviews();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(loaderRef.current);

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [hasMore, isLoadingMore, reviews.length, filter]);

  if (!mounted || loading) {
    return <PageLoading />;
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>{error}</div>
        <button onClick={() => loadInitialReviews(filter)} className={styles.retryButton}>
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <section className={styles.container}>
      <header className={styles.header}>
        <nav className={styles.filter}>
          <button
            className={clsx({ [styles.active]: filter === 'latest' })}
            onClick={filterHandler('latest')}>
            최신
          </button>
          <button
            className={clsx({ [styles.active]: filter === 'popular' })}
            onClick={filterHandler('popular')}>
            인기
          </button>
          <button
            className={clsx({ [styles.active]: filter === 'following' })}
            onClick={filterHandler('following')}>
            팔로잉
          </button>
        </nav>
        <BasicButton
          name={
            <>
              <PenSquare size={18} />
              <span>글쓰기</span>
            </>
          }
          handler={writeReviewHandler}
          height="36"
        />
      </header>

      <ul className={styles.list}>
        {reviews.map((review) => (
          <ReviewCard key={review.reviewId} review={review} />
        ))}
      </ul>

      {/* 로딩 트리거용 div */}
      {hasMore && <div ref={loaderRef} style={{ height: '60px' }} />}

      {isLoadingMore && <div style={{ textAlign: 'center', padding: '20px' }}>로딩 중...</div>}

      {reviews.length === 0 && (
        <div className={styles.empty}>
          {filter === 'following' ? (
            <>
              <p>팔로잉한 유저가 없습니다.</p>
            </>
          ) : (
            <>
              <p>아직 작성된 독후감이 없습니다.</p>
              <button className={styles.emptyButton} onClick={writeReviewHandler}>
                첫 독후감 작성하기
              </button>
            </>
          )}
        </div>
      )}
    </section>
  );
}

export default ReviewFeed;
