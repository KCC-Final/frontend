import ReadingGroupDetails from '@/components/groups/details';

import type { Metadata } from 'next';

export async function generateStaticParams() {
  // TODO: 백엔드에서 동적 라우팅될 목록의 id 범위 불러오기
  const tempIdArray = Array.from({ length: 10 }, (_, index) => ({
    id: String(index + 1)
  }));
  return tempIdArray;
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  // TODO: SEO를 위한 데이터 수정 필요
  return {
    title: '{group.groupName} | 그루 독서모임',
    description: '{group.content.substring(0, 150)}'
  };
}

interface ReadingGroupDetailsPageProps {
  params: { id: string };
}

function ReadingGroupDetailsPage({ params }: ReadingGroupDetailsPageProps) {
  return (
    <>
      <ReadingGroupDetails />
      {params.id}
    </>
  );
}

export default ReadingGroupDetailsPage;
