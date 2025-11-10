import GlobalLayout from '@/components/common/layout';
import ReviewEdit from '@/components/reviews/edit/edit';

import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  // TODO: 백엔드에서 동적 라우팅될 목록의 id 범위 불러오기
  const tempIdArray = Array.from({ length: 10 }, (_, index) => ({
    id: String(index + 1)
  }));
  return tempIdArray;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;

  // TODO: SEO를 위한 데이터 수정 필요
  return {
    title: `${id} | 그루 독후감`,
    description: '{review.reviewContent.substring(0, 150)}'
  };
}

async function ReviewEditPage() {
  return (
    <GlobalLayout>
      <ReviewEdit />
    </GlobalLayout>
  );
}

export default ReviewEditPage;
