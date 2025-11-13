import axiosGroo from '@/apis/groo/config';
import {
  ReviewCreateReqBody,
  ReviewCreateResDTO,
  ReviewUpdateReqBody,
  ReviewUpdateResDTO,
  ReviewDeleteResDTO,
  ReviewDetailResDTO,
  ReviewListResDTO,
  ReviewData,
  DraftData,
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
  getReview: async (reviewId: number): Promise<ReviewDetailResDTO['data']> => {
    const response = await axiosGroo.get<ReviewDetailResDTO['data']>(`/reviews/${reviewId}`);
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

  // 임시저장 목록 조회 - 배열 직접 반환, DraftData 타입으로 매핑
  getDrafts: async (): Promise<DraftData[]> => {
    const response = await axiosGroo.get<any[]>('/reviews/drafts');
    // 백엔드 응답을 DraftData 타입으로 매핑
    return response.data.map((draft) => ({
      reviewId: draft.reviewId,
      isbn: draft.isbn,
      reviewTitle: draft.reviewTitle,
      reviewContent: draft.reviewContent,
      createdAt: draft.createdAt,
      updatedAt: draft.updatedAt,
      category: draft.category
    }));
  },

  // 임시저장 글 단건 조회 - 객체 직접 반환, DraftData 타입으로 매핑
  getDraft: async (id: number): Promise<DraftData> => {
    const response = await axiosGroo.get<any>(`/reviews/drafts/${id}`);
    // 백엔드 응답을 DraftData 타입으로 매핑
    return {
      reviewId: response.data.reviewId,
      isbn: response.data.isbn,
      reviewTitle: response.data.reviewTitle,
      reviewContent: response.data.reviewContent,
      createdAt: response.data.createdAt,
      updatedAt: response.data.updatedAt,
      category: response.data.category
    };
  },

  // 임시저장 글 삭제
  deleteDraft: async (id: number): Promise<void> => {
    await axiosGroo.delete(`/reviews/drafts/${id}`);
  },

  // 좋아요 추가
  likeReview: async (reviewId: number): Promise<LikeCreateResDTO> => {
    const response = await axiosGroo.post<LikeCreateResDTO>(`/reviews/${reviewId}/like`);
    return response.data;
  },

  // 좋아요 취소
  unlikeReview: async (reviewId: number): Promise<LikeDeleteResDTO> => {
    const response = await axiosGroo.delete<LikeDeleteResDTO>(`/reviews/${reviewId}/like`);
    return response.data;
  },

  // 좋아요한 독후감 목록 조회
  getLikedReviews: async (): Promise<LikedReviewsResDTO> => {
    const response = await axiosGroo.get<LikedReviewsResDTO>('/reviews/likes/me');
    return response.data;
  },

  // 독후감 인기순 조회 (1주일간 좋아요 많은 순)
  getAllReviewsOrderByLikes: async (): Promise<ReviewListResDTO> => {
    const response = await axiosGroo.get<ReviewListResDTO>('/reviews/popular');
    return response.data;
  },

  // 팔로잉 유저 독후감 조회
  getReviewsByFollowing: async (): Promise<ReviewListResDTO> => {
    const response = await axiosGroo.get<ReviewListResDTO>('/reviews/following');
    return response.data;
  },

  // ISBN으로 독후감 조회
  getReviewsByIsbn: async (isbn: string): Promise<ReviewData[]> => {
    const response = await axiosGroo.get<ReviewData[]>(`/reviews/isbn/${isbn}`);
    return response.data;
  },

  // 카테고리로 독후감 조회
  getReviewsByCategory: async (category: string, limit: number = 20): Promise<ReviewData[]> => {
    const response = await axiosGroo.get<ReviewData[]>(`/reviews/category`, {
      params: { name: category, limit }
    });
    return response.data;
  },

  // 특정 유저의 독후감 조회
  getReviewsByUserId: async (userId: string): Promise<ReviewListResDTO> => {
    const response = await axiosGroo.get<ReviewListResDTO>(`/reviews/user/${userId}`);
    return response.data;
  },

  // 특정 유저가 좋아요한 독후감 조회
  getLikedReviewsByUserId: async (userId: string): Promise<ReviewListResDTO> => {
    const response = await axiosGroo.get<ReviewListResDTO>(`/reviews/user/${userId}/likes`);
    return response.data;
  }
};
