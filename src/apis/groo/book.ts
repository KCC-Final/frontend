import axiosGroo from './config';

import { GetDailyQuoteResDTO } from '@/types';

export const book = {
  // 오늘의 한 문장
  getDailyQuote: async (): Promise<GetDailyQuoteResDTO> => {
    const response = await axiosGroo.get('/quotes/daily');
    return response.data;
  }
};
