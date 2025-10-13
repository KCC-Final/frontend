import { CommonResDTO } from '@/types';

// 회원가입
export type SignupReqBody = {
  userId: string;
  password1: string;
  password2: string;
  nickname: string;
  email: string;
  name: string;
  gender: 'm' | 'f';
  birth: string;
  checkService: boolean;
  checkPrivacy: boolean;
};
export type SignupResDTO = CommonResDTO<null>;

// 아이디 중복확인
export type VerifyUserIdReqQuery = { userId: string };
export type VerifyUserIdResDTO = CommonResDTO<string>;

// 이메일 인증번호 전송
export type SendEmailCodeReqQuery = { purpose: string; email: string };
export type SendEmailCodeResDTO = CommonResDTO<string>;

// 이메일 인증번호 확인
export type VerifyEmailReqQuery = { purpose: string; email: string; code: string };
export type VerifyEmailResDTO = CommonResDTO<string>;

// 아이디 찾기
export type FindIdReqBody = { name: string; email: string };
export type FindIdResDTO = CommonResDTO<string>;

// 비밀번호 재설정
export type ChangePasswordReqBody = { userId: string; password1: string; password2: string };
export type ChangePasswordResDTO = CommonResDTO;

// 내 정보 조회
export type User = {
  userId: string;
  password: string;
  email: string;
  nickname: string;
  profileImage: string | null;
  introduction: string | null;
  gender: 'm' | 'f';
  name: string;
  birth: string;
  createdAt: string;
  withdrawalStatus: boolean;
  withdrawalDate: string | null;
  pwdChangedAt: string | null;
  checkPrivacy: boolean;
  checkService: boolean;
  emailVerified: boolean;
};
export type GetMyInfoResDTO = CommonResDTO<User>;
