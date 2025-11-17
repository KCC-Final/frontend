/**
 * 도서 추천 관련 타입 정의
 */

export interface RecommendationResponse {
  isbn: string;
  score: number;
  reason: string;
  similarUserCount: number;
}

export interface BookInfo {
  isbn: string;
  title: string;
  author: string;
  coverImage: string;
  publisher: string;
  publicationDate?: string;
  description?: string;
}

export type RecommendationType = 'personalized' | 'popular';

export interface RecommendationSectionProps {
  type?: RecommendationType;
  title?: string;
  limit?: number;
  showRanking?: boolean;
}

export interface BookCardProps {
  isbn: string;
  reason?: string;
  similarUserCount?: number;
  ranking?: number;
  showRanking?: boolean;
}
