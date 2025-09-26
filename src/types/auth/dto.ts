import { CommonResDTO } from '@/types';

// 로그인
export type LoginReqBody = { userId: string; password: string };
export type LoginResDTO = CommonResDTO<null>;

// 로그아웃
export type LogoutResDTO = CommonResDTO<null>;
