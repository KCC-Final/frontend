import { Metadata } from 'next';
import { cookies } from 'next/headers';

import styles from './page.module.scss';

import { fetchAladin, fetchGrooInServer } from '@/apis';
import GlobalLayout from '@/components/common/layout';
import ReviewDetail from '@/components/reviews/detail/review-detail';
import { getTokenInCookie } from '@/utils/cookie';
import { getReviewErrorMessage } from '@/utils/error/review-error-handler';

interface ReviewDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ReviewDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const reviewId = Number(id);

  const token = getTokenInCookie(await cookies());

  try {
    const review = await fetchGrooInServer.review.getReview(token, reviewId);

    if (!review) {
      return {
        title: '독후감을 찾을 수 없음',
        description: '요청하신 독후감을 찾을 수 없습니다.'
      };
    }

    const description = review.reviewContent
      ? review.reviewContent.substring(0, 150)
      : '독후감 내용이 없습니다.';

    return {
      title: `그루 | ${review.reviewTitle}`,
      description,
      openGraph: {
        title: `그루 | ${review.reviewTitle}`,
        description
      },
      alternates: {
        canonical: `https://www.groo.com/reviews/${id}`
      }
    };
  } catch (error) {
    return {
      title: '오류',
      description: '독후감 정보를 가져오는 데 실패했습니다.'
    };
  }
}

async function ReviewDetailPage({ params }: ReviewDetailPageProps) {
  const { id } = await params;
  const reviewId = Number(id);

  const token = getTokenInCookie(await cookies());

  try {
    const reviewData = await fetchGrooInServer.review.getReview(token, reviewId);

    if (!reviewData || !reviewData.reviewId) {
      return (
        <div className={styles.container}>
          <div className={styles.error}>독후감을 찾을 수 없습니다.</div>
        </div>
      );
    }

    // 추가 데이터를 병렬로 가져옵니다.
    const [bookInfoResponse, followInfoResponse] = await Promise.all([
      fetchAladin.getBookDetails(reviewData.isbn),
      reviewData.isOwner
        ? Promise.resolve(null)
        : fetchGrooInServer.review.getFollowInfo(token, reviewData.userId)
    ]);

    const bookInfo = bookInfoResponse?.item?.[0] || null;
    const initialIsFollowing = !!followInfoResponse?.data;

    return (
      <GlobalLayout size="sm">
        <ReviewDetail reviewData={reviewData} bookInfo={bookInfo} initialIsFollowing={initialIsFollowing} />
      </GlobalLayout>
    );
  } catch (error: any) {
    const errorMessage = getReviewErrorMessage(error);
    return (
      <div className={styles.container}>
        <div className={styles.error}>{errorMessage}</div>
      </div>
    );
  }
}

export default ReviewDetailPage;
