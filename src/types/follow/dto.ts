import { CommonResDTO } from '@/types';

/**
 * 팔로우 생성 요청 바디
 */
export type FollowReqBody = {
  followed: string; // 팔로우할 대상 유저 ID
};

/**
 * 팔로우 관계 데이터
 */
export type FollowData = {
  followId: number; // 팔로우 관계 ID
  follower: string; // 팔로우한 유저 ID
  followed: string; // 팔로우받은 유저 ID
  mutual: boolean; // 맞팔로우 여부
  createdAt: string; // 팔로우 생성 일시
};

/**
 * 팔로우 생성 응답 DTO
 */
export type FollowCreateResDTO = CommonResDTO<FollowData>;

/**
 * 팔로우 정보 조회 응답 DTO
 */
export type FollowInfoResDTO = CommonResDTO<FollowData>;

/**
 * 팔로우 삭제 응답 DTO
 */
export type FollowDeleteResDTO = CommonResDTO<null>;

/**
 * 팔로우 유저 정보
 */
export type FollowUserInfo = {
  followId: number; // 팔로우 관계 ID
  userId: string; // 유저 ID
  nickname: string; // 닉네임
  profileImage: string | null; // 프로필 이미지 URL
  followedAt: string; // 팔로우한 일시
};

/**
 * 팔로우 목록 조회 응답 DTO (팔로워/팔로잉 리스트)
 */
export type FollowListResDTO = CommonResDTO<FollowUserInfo[]>;

/**
 * 팔로우 수 조회 응답 DTO (팔로워/팔로잉 카운트)
 */
export type FollowCountResDTO = CommonResDTO<number>;
