import ReviewFeed from '@/components/reviews/feed';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '독후감 피드 | 그루',
  description: '다양한 독서 경험을 공유하는 독후감 피드'
};

export default function ReviewsPage() {
  return <ReviewFeed />;
}
