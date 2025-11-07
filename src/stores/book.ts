import { create } from 'zustand';

import { fetchGroo } from '@/apis';
import { devLogger } from '@/utils/dev-logger';

interface BookState {
  isbn: string | null;
  reviewCount: number | null;
  scrapCount: number | null;
}

interface BookActions {
  fetchBookStats: (isbn13: string) => Promise<void>;
}

export const useBookStore = create<BookState & BookActions>((set) => ({
  isbn: null,
  reviewCount: null,
  scrapCount: null,
  fetchBookStats: async (isbn13: string) => {
    try {
      const result = await fetchGroo.book.getBookInfoByIsbn(isbn13);
      set({ isbn: isbn13, reviewCount: result.data.reviewCount, scrapCount: result.data.scrapCount });
    } catch {
      devLogger('독후감 및 스크랩 수 조회 실패', true);
    }
  }
}));
