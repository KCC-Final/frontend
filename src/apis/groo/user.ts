import axiosGroo from './config';

import {
  CommonResDTO,
  SendEmailCodeReqQuery,
  SignupReqBody,
  VerifyEmailReqQuery,
  VerifyUserIdReqBody
} from '@/types';

export const user = {
  // 회원가입
  signup: async (data: SignupReqBody): Promise<CommonResDTO> => {
    const response = await axiosGroo.post('/users/signup', data);
    return response.data;
  },

  // 아이디 중복확인
  verifyUserId: async (data: VerifyUserIdReqBody): Promise<CommonResDTO> => {
    const response = await axiosGroo.post('/users/id/verify', data);
    return response.data;
  },

  // 이메일 인증번호 전송
  sendEmailCode: async (query: SendEmailCodeReqQuery): Promise<CommonResDTO<string>> => {
    const response = await axiosGroo.post(`/email?purpose=${query.purpose}&email=${query.email}`);
    return response.data;
  },

  // 이메일 인증번호 확인
  verifyEmail: async (query: VerifyEmailReqQuery): Promise<CommonResDTO<string>> => {
    const response = await axiosGroo.post(
      `/email/verify?purpose=${query.purpose}&email=${query.email}&code=${query.code}`
    );
    return response.data;
  }
};
