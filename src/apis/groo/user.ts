import { axiosGroo } from './config';

import { SendEmailCodeReqBody, SignupReqBody, VerifyEmailReqBody, VerifyUserIdReqBody } from '@/types';

export const user = {
  // 회원가입
  signup: async (data: SignupReqBody) => {
    const response = await axiosGroo.post('/users/signup', data);
    return response.data;
  },

  // 아이디 중복확인
  verifyUserId: async (data: VerifyUserIdReqBody) => {
    const response = await axiosGroo.post('/users/id/verify', data);
    return response.data;
  },

  // 이메일 인증번호 전송
  sendEmailCode: async (data: SendEmailCodeReqBody) => {
    const response = await axiosGroo.post('/users/email', data);
    return response.data;
  },

  // 이메일 인증번호 확인
  verifyEmail: async (data: VerifyEmailReqBody) => {
    const response = await axiosGroo.post('/users/email/verify', data);
    return response.data;
  }

  // // 회원정보 조회
  // getMyData: async () => {
  //   const response = await axiosGroo.get(`/users`);
  //   return response.data;
  // },

  // // 회원정보 수정
  // editMyData: async () => {
  //   const response = await axiosGroo.put('/users');
  //   return response.data;
  // },

  // // 회원탈퇴
  // deleteMyData: async () => {
  //   const response = await axiosGroo.delete('/users');
  //   return response.data;
  // },

  // // 아이디 찾기
  // findMyId: async () => {
  //   const response = await axiosGroo.post('/users/id');
  //   return response.data;
  // },

  // // 비밀번호 재설정
  // editMyPassword: async () => {
  //   const response = await axiosGroo.put('/users/password');
  //   return response.data;
  // },

  // // 팔로우
  // follow: async (userId: string) => {
  //   const response = await axiosGroo.post(`/users/follows/${userId}`);
  //   return response.data;
  // },

  // // 팔로우 취소
  // cancelFollow: async (userId: string) => {
  //   const response = await axiosGroo.delete(`/users/follows/${userId}`);
  //   return response.data;
  // },

  // // 팔로잉 목록 조회
  // getFollowingList: async () => {
  //   const response = await axiosGroo.get('/users/following');
  //   return response.data;
  // },

  // // 팔로워 목록 조회
  // getFollowerList: async () => {
  //   const response = await axiosGroo.get('/users/followed');
  //   return response.data;
  // }
};
