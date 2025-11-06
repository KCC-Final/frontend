'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import styles from './page.module.scss';

import { review as reviewApi } from '@/apis/groo/review';
import ReviewDetail from '@/components/reviews/detail/review-detail';
import { ReviewDetailResDTO } from '@/types/reviews';
import { getReviewErrorMessage } from '@/utils/error/review-error-handler';

export default function ReviewDetailPage() {
  const params = useParams();
  const reviewId = Number(params.id);
  const [reviewData, setReviewData] = useState<ReviewDetailResDTO['data'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviewDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await reviewApi.getReview(reviewId);

        if (response && response.reviewId) {
          setReviewData(response);
        } else {
          setError('독후감을 불러오는데 실패했습니다.');
        }
      } catch (error: any) {
        const errorMessage = getReviewErrorMessage(error);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (reviewId) {
      fetchReviewDetail();
    }
  }, [reviewId]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>독후감을 불러오는 중...</div>
      </div>
    );
  }

  if (error || !reviewData) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>{error || '독후감을 찾을 수 없습니다.'}</div>
      </div>
    );
  }

  return <ReviewDetail reviewData={reviewData} />;
}
