import axiosGroo from './config';

import {
  ChangePasswordReqBody,
  ChangePasswordResDTO,
  CommonResDTO,
  FindIdReqBody,
  FindIdResDTO,
  SendEmailCodeReqQuery,
  SendEmailCodeResDTO,
  SignupReqBody,
  VerifyEmailReqQuery,
  VerifyEmailResDTO,
  VerifyUserIdReqQuery,
  VerifyUserIdResDTO
} from '@/types';

export const user = {
  // 회원가입
  signup: async (data: SignupReqBody): Promise<CommonResDTO> => {
    const response = await axiosGroo.post('/users/signup', data);
    return response.data;
  },

  // 아이디 중복확인
  verifyUserId: async (query: VerifyUserIdReqQuery): Promise<VerifyUserIdResDTO> => {
    const response = await axiosGroo.post(`/users/id/verify?userId=${query.userId}`);
    return response.data;
  },

  // 이메일 인증번호 전송
  sendEmailCode: async (query: SendEmailCodeReqQuery): Promise<SendEmailCodeResDTO> => {
    const response = await axiosGroo.post(`/email?purpose=${query.purpose}&email=${query.email}`);
    return response.data;
  },

  // 이메일 인증번호 확인
  verifyEmail: async (query: VerifyEmailReqQuery): Promise<VerifyEmailResDTO> => {
    const response = await axiosGroo.post(
      `/email/verify?purpose=${query.purpose}&email=${query.email}&code=${query.code}`
    );
    return response.data;
  },

  // 아이디 찾기
  findId: async (data: FindIdReqBody): Promise<FindIdResDTO> => {
    const response = await axiosGroo.post('/users/id', data);
    return response.data;
  },

  // 비밀번호 재설정
  changePassword: async (data: ChangePasswordReqBody): Promise<ChangePasswordResDTO> => {
    const response = await axiosGroo.post('/users/password', data);
    return response.data;
  }
};
