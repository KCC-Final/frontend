import axiosGroo from '@/apis/groo/config';
import {
  FollowReqBody,
  FollowCreateResDTO,
  FollowInfoResDTO,
  FollowDeleteResDTO,
  FollowListResDTO,
  FollowCountResDTO
} from '@/types/follow/dto';

export const follow = {
  // 팔로우 생성
  createFollow: async (targetUserId: string): Promise<FollowCreateResDTO> => {
    const response = await axiosGroo.post<FollowCreateResDTO>('/users/follows', {
      followed: targetUserId
    } as FollowReqBody);
    return response.data;
  },

  // 팔로우 정보 조회
  getFollowInfo: async (targetUserId: string): Promise<FollowInfoResDTO> => {
    const response = await axiosGroo.get<FollowInfoResDTO>(`/users/follows/${targetUserId}`);
    return response.data;
  },

  // 팔로우 삭제 (언팔로우)
  deleteFollow: async (targetUserId: string): Promise<FollowDeleteResDTO> => {
    const response = await axiosGroo.delete<FollowDeleteResDTO>(`/users/follows/${targetUserId}`);
    return response.data;
  },

  // 내가 팔로잉한 유저 목록 조회
  getFollowingList: async (): Promise<FollowListResDTO> => {
    const response = await axiosGroo.get<FollowListResDTO>('/users/following');
    return response.data;
  },

  // 나를 팔로우한 유저 목록 조회
  getFollowerList: async (): Promise<FollowListResDTO> => {
    const response = await axiosGroo.get<FollowListResDTO>('/users/followers');
    return response.data;
  },

  // 내 팔로워 수 조회
  getFollowerCount: async (): Promise<FollowCountResDTO> => {
    const response = await axiosGroo.get<FollowCountResDTO>('/users/followers-count');
    return response.data;
  },

  // 내 팔로잉 수 조회
  getFollowingCount: async (): Promise<FollowCountResDTO> => {
    const response = await axiosGroo.get<FollowCountResDTO>('/users/following-count');
    return response.data;
  },

  //특정 유저의 팔로워 수 조회

  getUserFollowerCount: async (userId: string): Promise<FollowCountResDTO> => {
    const response = await axiosGroo.get<FollowCountResDTO>(`/users/${userId}/followers-count`);
    return response.data;
  },

  // 특정 유저의 팔로잉 수 조회
  getUserFollowingCount: async (userId: string): Promise<FollowCountResDTO> => {
    const response = await axiosGroo.get<FollowCountResDTO>(`/users/${userId}/following-count`);
    return response.data;
  },

  //특정 유저의 팔로워 리스트 조회
  getUserFollowerList: async (userId: string): Promise<FollowListResDTO> => {
    const response = await axiosGroo.get<FollowListResDTO>(`/users/${userId}/followers`);
    return response.data;
  },
  //특정 유저의 팔로잉 리스트 조회
  getUserFollowingList: async (userId: string): Promise<FollowListResDTO> => {
    const response = await axiosGroo.get<FollowListResDTO>(`/users/${userId}/following`);
    return response.data;
  }
};
