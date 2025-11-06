import axiosGroo from './config';

import { GetBookInfoResDTO, GetDailyQuoteResDTO } from '@/types';

export const book = {
  // 오늘의 한 문장
  getDailyQuote: async (): Promise<GetDailyQuoteResDTO> => {
    const response = await axiosGroo.get('/quotes/daily');
    return response.data;
  },

  getBookInfoByIsbn: async (isbn: string): Promise<GetBookInfoResDTO> => {
    const response = await axiosGroo.get(`/books/${isbn}`);
    return response.data;
  }
};
