'use client';

import { PenSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import styles from './review-feed.module.scss';

import { fetchAladin } from '@/apis/aladin';
import { fetchGroo } from '@/apis/groo';
import { ReviewData } from '@/types/reviews';

interface BookCoverProps {
  isbn: string;
  title: string;
}

function BookCover({ isbn, title }: BookCoverProps) {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookCover = async () => {
      try {
        const data = await fetchAladin.getBookDetails(isbn);

        if (data.item && data.item[0] && data.item[0].cover) {
          setImageUrl(data.item[0].cover);
        }
      } catch (error) {
        console.error('책 표지 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isbn) {
      fetchBookCover();
    }
  }, [isbn]);

  if (loading) {
    return (
      <div className={styles.bookCover}>
        <div className={styles.noImage}>
          <span>로딩 중...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.bookCover}>
      {imageUrl && <div className={styles.blurBackground} style={{ backgroundImage: `url(${imageUrl})` }} />}
      {imageUrl ? (
        <img src={imageUrl} alt={title} className={styles.bookImage} />
      ) : (
        <div className={styles.noImage}>
          <span>표지 없음</span>
        </div>
      )}
    </div>
  );
}

export default function ReviewFeed() {
  const router = useRouter();
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'latest' | 'popular' | 'following'>('latest');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadReviews('latest');
  }, []);

  const loadReviews = async (filterType: 'latest' | 'popular' | 'following') => {
    try {
      setLoading(true);
      let response;

      if (filterType === 'popular') {
        try {
          response = await fetchGroo.review.getAllReviewsOrderByLikes();
        } catch (error) {
          console.error('인기순 조회 실패, 최신순으로 대체:', error);
          response = await fetchGroo.review.getAllReviews();
        }
      } else if (filterType === 'following') {
        try {
          response = await fetchGroo.review.getReviewsByFollowing();
        } catch (error) {
          console.error('팔로잉 조회 실패, 최신순으로 대체:', error);
          response = await fetchGroo.review.getAllReviews();
        }
      } else {
        response = await fetchGroo.review.getAllReviews();
      }

      let reviewsData = Array.isArray(response) ? response : response.data || [];

      // 비공개 글 제외
      reviewsData = reviewsData.filter((review: ReviewData) => !review.secret);

      setReviews(reviewsData);
    } catch (error) {
      console.error('독후감 목록 조회 실패:', error);
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
    router.push('/reviews/write');
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
        {reviews &&
          reviews.length > 0 &&
          reviews.map((review) => (
            <article
              key={review.reviewId}
              className={styles.reviewCard}
              onClick={() => handleReviewClick(review.reviewId)}>
              <BookCover isbn={review.isbn} title={review.reviewTitle} />

              <div className={styles.reviewInfo}>
                <div className={styles.userInfo}>
                  <div className={styles.avatar}>{review.userId?.[0]?.toUpperCase() || 'U'}</div>
                  <div className={styles.userDetails}>
                    <span className={styles.nickname}>{review.userId}</span>
                    <span className={styles.date}>
                      {new Date(review.createdAt).toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>

                <h2 className={styles.reviewTitle}>{review.reviewTitle}</h2>

                <p className={styles.category}>{review.category}</p>

                <div className={styles.reviewContent}>
                  {review.reviewContent?.replace(/<[^>]*>/g, '').substring(0, 100)}...
                </div>

                <div className={styles.stats}>
                  <span className={styles.stat}>좋아요 {review.likeCount || 0}</span>
                  <span className={styles.stat}> 댓글 {review.commentCount || 0}</span>
                </div>
              </div>
            </article>
          ))}
      </div>

      {(!reviews || reviews.length === 0) && (
        <div className={styles.empty}>
          <p>아직 작성된 독후감이 없습니다.</p>
          <button className={styles.emptyButton} onClick={handleWriteReview}>
            첫 독후감 작성하기
          </button>
        </div>
      )}
    </div>
  );
}
