import createAxiosInServer from '@/apis/groo/server/config';
import { GetDailyQuoteResDTO, Token } from '@/types';
import { setTokenInHeader } from '@/utils/cookie';

export const book = {
  // 오늘의 한 문장
  getDailyQuote: async (token: Token): Promise<GetDailyQuoteResDTO> => {
    const axiosGrooInServer = createAxiosInServer();
    const headers = setTokenInHeader(token.accessToken, token.refreshToken);

    const response = await axiosGrooInServer.get('/quotes/daily', { headers });
    return response.data;
  }
};
