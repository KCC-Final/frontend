import { CommonResDTO } from '@/types';

// 로그인
export type LoginReqBody = { userId: string; password: string };
export type LoginResDTO = CommonResDTO<{ accessToken: string; refreshToken: string }>;

// 로그아웃
export type LogoutResDTO = CommonResDTO<null>;

// 토큰 재발행
export type ReissueTokenResDTO = CommonResDTO<string>;
