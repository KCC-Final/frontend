import { fetchAladin } from '@/apis';
import BookInformation from '@/components/books';

import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;

  // TODO: SEO를 위한 데이터 수정 필요
  return {
    title: `${id} | 그루 도서정보`,
    description: '{book.desciption.substring(0, 150)}'
  };
}

async function BookDetailsPage({ params }: PageProps) {
  const { id } = await params;

  const bookDetailsResponse = await fetchAladin.getBookDetails(id);
  const bookInfo = bookDetailsResponse.item[0];

  return <BookInformation bookInfo={bookInfo} />;
}

export default BookDetailsPage;
