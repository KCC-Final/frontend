import MyBookshelf from '@/components/my-bookshelf';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '내 책장 | 그루',
  description: '나만의 책장을 만들고 도서를 저장하세요'
};

export default function MyBookshelfPage() {
  return <MyBookshelf />;
}
