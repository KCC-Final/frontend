import axiosGroo from '@/apis/groo/config';
import {
  ReviewCreateReqBody,
  ReviewCreateResDTO,
  ReviewUpdateReqBody,
  ReviewUpdateResDTO,
  ReviewDeleteResDTO,
  ReviewDetailResDTO,
  ReviewListResDTO,
  DraftListResDTO,
  DraftDetailResDTO,
  DraftDeleteResDTO,
  LikeCreateResDTO,
  LikeDeleteResDTO,
  LikedReviewsResDTO
} from '@/types/reviews';

export const review = {
  // 독후감 작성
  createReview: async (data: ReviewCreateReqBody): Promise<ReviewCreateResDTO> => {
    const response = await axiosGroo.post<ReviewCreateResDTO>('/reviews', data);
    return response.data;
  },

  // 독후감 수정
  updateReview: async (reviewId: number, data: ReviewUpdateReqBody): Promise<ReviewUpdateResDTO> => {
    const response = await axiosGroo.put<ReviewUpdateResDTO>(`/reviews/${reviewId}`, data);
    return response.data;
  },

  // 독후감 삭제
  deleteReview: async (reviewId: number): Promise<ReviewDeleteResDTO> => {
    const response = await axiosGroo.delete<ReviewDeleteResDTO>(`/reviews/${reviewId}`);
    return response.data;
  },

  // 독후감 단건 조회
  getReview: async (reviewId: number): Promise<ReviewDetailResDTO> => {
    const response = await axiosGroo.get<ReviewDetailResDTO>(`/reviews/${reviewId}`);
    return response.data;
  },

  // 독후감 전체 조회
  getAllReviews: async (): Promise<ReviewListResDTO> => {
    const response = await axiosGroo.get<ReviewListResDTO>('/reviews');
    return response.data;
  },

  // 내가 작성한 독후감 조회
  getMyReviews: async (): Promise<ReviewListResDTO> => {
    const response = await axiosGroo.get<ReviewListResDTO>('/reviews/my');
    return response.data;
  },

  // 임시저장 목록 조회
  getDrafts: async (): Promise<DraftListResDTO> => {
    const response = await axiosGroo.get<DraftListResDTO>('/reviews/drafts');
    return response.data;
  },

  // 임시저장 글 단건 조회
  getDraft: async (id: number): Promise<DraftDetailResDTO> => {
    const response = await axiosGroo.get<DraftDetailResDTO>(`/reviews/drafts/${id}`);
    return response.data;
  },

  // 임시저장 글 삭제
  deleteDraft: async (id: number): Promise<DraftDeleteResDTO> => {
    const response = await axiosGroo.delete<DraftDeleteResDTO>(`/reviews/drafts/${id}`);
    return response.data;
  },

  // 좋아요 추가
  likeReview: async (reviewId: number): Promise<LikeCreateResDTO> => {
    const response = await axiosGroo.post<LikeCreateResDTO>(`/reviews/${reviewId}/likes`);
    return response.data;
  },

  // 좋아요 취소
  unlikeReview: async (reviewId: number): Promise<LikeDeleteResDTO> => {
    const response = await axiosGroo.delete<LikeDeleteResDTO>(`/reviews/${reviewId}/likes`);
    return response.data;
  },

  // 좋아요한 독후감 목록 조회
  getLikedReviews: async (): Promise<LikedReviewsResDTO> => {
    const response = await axiosGroo.get<LikedReviewsResDTO>('/reviews/likes');
    return response.data;
  }
};
