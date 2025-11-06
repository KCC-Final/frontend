import { create } from 'zustand';

import {
  getBestsellers,
  getBookDetailsListByIsbn,
  getDailyQuote,
  getHotTrendBooks,
  getLibrarianRecommends
} from '@/hooks/fetch/home';
import { AladinBestsellerItem, AladinBookDetailsItem, DailyQuoteData } from '@/types';
import { devLogger } from '@/utils/dev-logger';

interface HomeState {
  quoteData: DailyQuoteData | null;
  bestSellerData: AladinBestsellerItem[];
  librarianRecommendData: AladinBookDetailsItem[];
  hotTrendBooksData: AladinBookDetailsItem[];
  loading: boolean;
  error: string;
}

interface HomeActions {
  fetchTopHomeData: () => Promise<void>;
  fetchLibrarianRecommendData: () => Promise<void>;
  fetchHotTrendBooksData: () => Promise<void>;
}

export const useHomeStore = create<HomeState & HomeActions>((set) => ({
  quoteData: null,
  bestSellerData: [],
  librarianRecommendData: [],
  hotTrendBooksData: [],
  loading: false,
  error: '',
  /** 오늘의 한 문장, 베스트 셀러 도서 목록 조회 */
  fetchTopHomeData: async () => {
    set({ loading: true, error: '' });

    const [quoteData, bestSellerData] = await Promise.all([getDailyQuote(), getBestsellers()]);
    set({
      quoteData,
      bestSellerData,
      loading: false
    });
  },
  /** 사서 추천 도서 목록 조회 */
  fetchLibrarianRecommendData: async () => {
    try {
      const isbnList = await getLibrarianRecommends();
      const librarianRecommendData = await getBookDetailsListByIsbn(isbnList);
      set({ librarianRecommendData });
    } catch (error) {
      devLogger(error, true);
      set({ librarianRecommendData: [] });
    }
  },
  /** 대출 급상승 도서 목록 조회 */
  fetchHotTrendBooksData: async () => {
    try {
      const isbnList = await getHotTrendBooks();
      const hotTrendBooksData = await getBookDetailsListByIsbn(isbnList);
      set({ hotTrendBooksData });
    } catch (error) {
      devLogger(error, true);
      set({ hotTrendBooksData: [] });
    }
  }
}));
