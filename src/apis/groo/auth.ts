import { axiosGroo } from './config';

import { LoginReqBody } from '@/types';

export const auth = {
  // 로그인
  login: async (data: LoginReqBody) => {
    const response = await axiosGroo.post('/auth/login', data);
    return response.data;
  },

  // 로그아웃
  logout: async () => {
    const response = await axiosGroo.post('/auth/logout');
    return response.data;
  }
};
