// src/apis/groo/comment.ts
import axiosGroo from '@/apis/groo/config';
import { CommentData } from '@/types/reviews';

export type CommentCreateReqBody = {
  content: string;
  parentId?: number;
};

export type CommentUpdateReqBody = {
  content: string;
};

export const comment = {
  // 댓글 작성
  createComment: async (reviewId: number, data: CommentCreateReqBody): Promise<any> => {
    const response = await axiosGroo.post(`/comments/${reviewId}`, data);
    return response.data;
  },

  // 댓글 수정
  updateComment: async (commentId: number, data: CommentUpdateReqBody): Promise<any> => {
    const response = await axiosGroo.put(`/comments/${commentId}`, data);
    return response.data;
  },

  // 댓글 삭제
  deleteComment: async (commentId: number): Promise<any> => {
    const response = await axiosGroo.delete(`/comments/${commentId}`);
    return response.data;
  },

  // 특정 리뷰의 댓글 목록 조회 - 배열 직접 반환
  getCommentsByReview: async (reviewId: number): Promise<CommentData[]> => {
    const response = await axiosGroo.get<CommentData[]>(`/comments/review/${reviewId}`);
    return response.data;
  }
};
