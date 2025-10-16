import axiosGroo from '@/apis/groo/config';
import { LoginReqBody, LoginResDTO, LogoutResDTO, ReissueTokenResDTO } from '@/types';

export const auth = {
  // 로그인
  login: async (data: LoginReqBody): Promise<LoginResDTO> => {
    const response = await axiosGroo.post('/auth/login', data);
    return response.data;
  },

  // 로그아웃
  logout: async (): Promise<LogoutResDTO> => {
    const response = await axiosGroo.post('/auth/logout');
    return response.data;
  },

  // 엑세스토큰 재발행
  reissueToken: async (): Promise<ReissueTokenResDTO> => {
    const response = await axiosGroo.post('/token-refresh');
    return response.data;
  }
};
