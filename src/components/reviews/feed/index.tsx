'use client';

import clsx from 'clsx';
import { PenSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';

import { fetchGroo } from '@/apis';
import BasicButton from '@/components/common/button/basic';
import ReviewCard from '@/components/common/review-card';
import styles from '@/components/reviews/feed/feed.module.scss';
import { ReviewData } from '@/types';
import { getReviewErrorMessage } from '@/utils/error/review-error-handler';

function ReviewFeed() {
  const router = useRouter();
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [visibleReviews, setVisibleReviews] = useState<ReviewData[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [filter, setFilter] = useState<'latest' | 'popular' | 'following'>('latest');
  const [mounted, setMounted] = useState(false);

  const loaderRef = useRef<HTMLDivElement | null>(null);
  const ITEMS_PER_PAGE = 16;

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

  const filterHandler = (filter: 'latest' | 'popular' | 'following') => () => {
    setFilter(filter);
    loadReviews(filter);
  };

  const writeReviewHandler = () => {
    router.push('/reviews/write?from=/reviews/feed');
  };

  // IntersectionObserver로 무한 스크롤 구현
  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && !loading) {
          // 현재 표시된 아이템 수를 기준으로 계산
          const start = visibleReviews.length;
          const end = start + ITEMS_PER_PAGE;
          const nextItems = reviews.slice(start, end);

          if (nextItems.length > 0) {
            setVisibleReviews((prev) => [...prev, ...nextItems]);
            setPage((prevPage) => prevPage + 1);
          }
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
  }, [reviews, visibleReviews.length, loading]);

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
        {visibleReviews.map((review) => (
          <ReviewCard key={review.reviewId} review={review} />
        ))}
      </ul>

      {/* 로딩 트리거용 div */}
      <div ref={loaderRef} style={{ height: '60px' }} />

      {visibleReviews.length === 0 && (
        <div className={styles.empty}>
          {filter === 'following' ? (
            <>
              <p>팔로잉한 유저가 없습니다.</p>
              <button className={styles.emptyButton} onClick={() => filterHandler('latest')}>
                전체 피드 보기
              </button>
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
