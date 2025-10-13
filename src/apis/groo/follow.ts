import axiosGroo from '@/apis/groo/config';
import {
  FollowReqBody,
  FollowCreateResDTO,
  FollowInfoResDTO,
  FollowDeleteResDTO,
  FollowListResDTO
} from '@/types/follow/dto';

export const follow = {
  createFollow: async (targetUserId: string): Promise<FollowCreateResDTO> => {
    const response = await axiosGroo.post<FollowCreateResDTO>('/users/follows', {
      followed: targetUserId
    } as FollowReqBody);
    return response.data;
  },

  getFollowInfo: async (targetUserId: string): Promise<FollowInfoResDTO> => {
    const response = await axiosGroo.get<FollowInfoResDTO>(`/users/follows/${targetUserId}`);
    return response.data;
  },

  deleteFollow: async (targetUserId: string): Promise<FollowDeleteResDTO> => {
    const response = await axiosGroo.delete<FollowDeleteResDTO>(`/users/follows/${targetUserId}`);
    return response.data;
  },

  getFollowingList: async (): Promise<FollowListResDTO> => {
    const response = await axiosGroo.get<FollowListResDTO>('/users/following');
    return response.data;
  },

  getFollowerList: async (): Promise<FollowListResDTO> => {
    const response = await axiosGroo.get<FollowListResDTO>('/users/followers');
    return response.data;
  }
};
