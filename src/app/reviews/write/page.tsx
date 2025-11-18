import { Suspense } from 'react';

import PageLoading from '@/components/common/loading';
import ReviewCreatePage from '@/components/reviews/write/review-create-page';

export default function ReviewWritePage() {
  return (
    <Suspense fallback={<PageLoading />}>
      <ReviewCreatePage />
    </Suspense>
  );
}
