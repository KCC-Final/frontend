import { CommonResDTO } from '@/types';

// 독후감 작성
export type ReviewCreateReqBody = {
  isbn: string;
  reviewTitle: string;
  reviewContent: string;
  secret: boolean;
  temporary: boolean;
  category?: string;
};
export type ReviewCreateResDTO = CommonResDTO<null>;

// 독후감 수정
export type ReviewUpdateReqBody = {
  reviewTitle?: string;
  reviewContent?: string;
  secret?: boolean;
  temporary?: boolean;
};
export type ReviewUpdateResDTO = CommonResDTO<null>;

// 독후감 삭제
export type ReviewDeleteResDTO = CommonResDTO<null>;

// 독후감 단건 조회
export type ReviewDetailResDTO = CommonResDTO<{
  reviewId: number;
  isbn: string;
  reviewTitle: string;
  reviewContent: string;
  secret: boolean;
  temporary: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
  category: string;
  likeCount: number;
  liked: boolean;
  comments?: CommentData[];
  isOwner: boolean; // 추가
}>;

// 독후감 목록 조회
export type ReviewListResDTO = CommonResDTO<ReviewData[]>;

// 독후감 데이터 타입
export type ReviewData = {
  reviewId: number;
  isbn: string;
  reviewTitle: string;
  reviewContent: string;
  secret: boolean;
  temporary: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
  category: string;
  likeCount: number;
  liked: boolean;
  commentCount: number;
};

// 임시저장 목록 조회
export type DraftListResDTO = CommonResDTO<DraftData[]>;

// 임시저장 단건 조회
export type DraftDetailResDTO = CommonResDTO<DraftData>;

// 임시저장 데이터 타입
export type DraftData = {
  reviewId: number;
  isbn: string;
  reviewTitle: string;
  reviewContent: string;
  createdAt: string;
  updatedAt: string;
  category: string;
};

// 임시저장 삭제
export type DraftDeleteResDTO = CommonResDTO<null>;

// 좋아요 추가
export type LikeCreateResDTO = CommonResDTO<null>;

// 좋아요 취소
export type LikeDeleteResDTO = CommonResDTO<null>;

// 좋아요한 독후감 목록
export type LikedReviewsResDTO = CommonResDTO<ReviewData[]>;

// 댓글 데이터 타입
export type CommentData = {
  commentId: number;
  content: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  parentId: number | null;
  isOwner: boolean; // 추가
};
