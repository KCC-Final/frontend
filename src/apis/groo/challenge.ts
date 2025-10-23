import axiosGroo from './config';

import { UserBadgeResponse, UserBadgeStatusResponse } from '@/types';

/**
 * Challenge 관련 API
 */
export const challenge = {
  /**
   * 특정 사용자의 전체 뱃지 목록 + 획득 상태/진행도 조회
   */
  async getAllBadgesWithStatus(userId: string): Promise<UserBadgeStatusResponse[]> {
    const response = await axiosGroo.get(`/challenges/users/${userId}/badges/all`);
    return response.data;
  },

  /**
   * 특정 사용자의 획득 뱃지 목록 조회
   */
  async getAcquiredBadges(userId: string): Promise<UserBadgeResponse[]> {
    const response = await axiosGroo.get(`/challenges/users/${userId}/badges`);
    return response.data;
  }
};
