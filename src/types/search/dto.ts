import { CommonResDTO } from '@/types';

export type SearchResultItem = {
  category: 'USER' | 'REVIEW' | 'COMMENT';
  id: string;
  title: string;
  subtext: string;
  content: string;
};

export type SearchResDTO = CommonResDTO<SearchResultItem[]>;
