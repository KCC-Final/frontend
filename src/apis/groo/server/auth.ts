import createAxiosInServer from '@/apis/groo/server/config';
import { setTokenInHeader } from '@/utils/cookie';

export const auth = {
  // 엑세스토큰 재발행
  reissueToken: async (refreshToken: string) => {
    const axiosGrooInServer = createAxiosInServer();
    const headers = setTokenInHeader('', refreshToken);

    const response = await axiosGrooInServer.post('/token-refresh', {}, { headers });
    return response;
  }
};
