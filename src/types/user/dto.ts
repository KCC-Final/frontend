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
export type VerifyUserIdReqBody = { userId: string };
export type VerifyUserIdResDTO = CommonResDTO<{ userId: string }>;

// 이메일 인증번호 전송
export type SendEmailCodeReqQuery = { purpose: string; email: string };
export type SendEmailCodeResDTO = CommonResDTO<{ email: string }>;

// 이메일 인증번호 확인
export type VerifyEmailReqQuery = { purpose: string; email: string; code: string };
export type VerifyEmailResDTO = CommonResDTO<{ email: string }>;
