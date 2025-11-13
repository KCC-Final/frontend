import createAxiosInServer from './config';

import { FollowInfoResDTO, Token } from '@/types';
import { ReviewDetailResDTO } from '@/types/reviews';
import { setTokenInHeader } from '@/utils/cookie';

export const review = {
  // 독후감 단건 조회
  getReview: async (token: Token, reviewId: number): Promise<ReviewDetailResDTO['data']> => {
    const axiosGrooInServer = createAxiosInServer();
    const headers = setTokenInHeader(token.accessToken, token.refreshToken);

    const response = await axiosGrooInServer.get<ReviewDetailResDTO['data']>(`/reviews/${reviewId}`, {
      headers
    });
    return response.data;
  },

  // 팔로우 정보 조회
  getFollowInfo: async (token: Token, targetUserId: string): Promise<FollowInfoResDTO> => {
    const axiosGrooInServer = createAxiosInServer();
    const headers = setTokenInHeader(token.accessToken, token.refreshToken);

    const response = await axiosGrooInServer.get<FollowInfoResDTO>(`/users/follows/${targetUserId}`, {
      headers
    });
    return response.data;
  }
};
