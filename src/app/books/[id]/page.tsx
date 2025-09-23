import BookDetails from '@/components/books/details';

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
    title: '{book.title} | 그루 도서정보',
    description: '{book.desciption.substring(0, 150)}'
  };
}

interface BookDetailsPageProps {
  params: Promise<{ id: string }>;
}

async function BookDetailsPage({ params }: BookDetailsPageProps) {
  const { id } = await params;

  return (
    <>
      <BookDetails />
      {id}
    </>
  );
}

export default BookDetailsPage;
