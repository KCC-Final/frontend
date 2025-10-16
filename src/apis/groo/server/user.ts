import createAxiosInServer from '@/apis/groo/server/config';
import { GetMyInfoResDTO, Token } from '@/types';
import { setTokenInHeader } from '@/utils/cookie';

export const user = {
  // 내 정보 조회
  getMyInfo: async (token: Token): Promise<GetMyInfoResDTO> => {
    const axiosGrooInServer = createAxiosInServer();
    const headers = setTokenInHeader(token.accessToken, token.refreshToken);

    const response = await axiosGrooInServer.get('/users', { headers });
    return response.data;
  }
};
