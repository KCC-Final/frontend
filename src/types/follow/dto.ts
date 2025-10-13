import { CommonResDTO } from '@/types';

export type FollowReqBody = {
  followed: string;
};

export type FollowData = {
  followId: number;
  follower: string;
  followed: string;
  mutual: boolean;
  createdAt: string;
};

export type FollowCreateResDTO = CommonResDTO<FollowData>;

export type FollowInfoResDTO = CommonResDTO<FollowData>;

export type FollowDeleteResDTO = CommonResDTO<null>;

export type FollowUserInfo = {
  followId: number;
  userId: string;
  nickname: string;
  profileImage: string | null;
  followedAt: string;
};

export type FollowListResDTO = CommonResDTO<FollowUserInfo[]>;
