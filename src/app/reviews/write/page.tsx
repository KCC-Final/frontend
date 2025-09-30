// src/app/reviews/write/page.tsx

import { Suspense } from 'react';

import ReviewCreatePage from '@/components/reviews/write/review-create-page';

export default function ReviewWritePage() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <ReviewCreatePage />
    </Suspense>
  );
}
