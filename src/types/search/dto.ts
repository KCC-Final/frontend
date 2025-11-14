import { CommonResDTO } from '@/types';

export type SearchResultItem = {
  category: 'USER' | 'REVIEW' | 'COMMENT' | 'BOOK'; // BOOK 추가
  id: string; // book은 isbn13
  title: string; // book.title
  subtext: string; // book.author
  content?: string; // BOOK에는 없으므로 optional 처리
};

export type SearchResDTO = CommonResDTO<SearchResultItem[]>;
