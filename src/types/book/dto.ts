import { CommonResDTO } from '@/types';

// 오늘의 한 문장 타입
// 문장 정보
export type Sentence = {
  sentenceId: number;
  sentenceContent: string;
  selectedDate: string;
  isbn: string;
};
// 책 정보
export type BookInfo = {
  title: string;
  author: string;
};
// data 객체
export type DailyQuoteData = {
  sentence: Sentence;
  book: BookInfo;
};
// 응답 DTO
export type GetDailyQuoteResDTO = CommonResDTO<DailyQuoteData>;

export type BookInfoData = {
  reviewCount: number;
  scrapCount: number;
};

export type GetBookInfoResDTO = CommonResDTO<BookInfoData>;
