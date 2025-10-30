import axiosGroo from '@/apis/groo/config';
import type { Bookshelf, BookshelfRequest, BookScrap, BookScrapRequest } from '@/types/bookshelf/bookshelf';

export const bookshelf = {
  /**
   *  책장 목록 조회
   * GET /api/v1/bookshelf/list
   */
  getBookshelfList: async (): Promise<Bookshelf[]> => {
    const response = await axiosGroo.get<{ data: Bookshelf[] }>('/bookshelf/list');
    return response.data.data;
  },

  /**
   * 책장 상세 조회
   * GET /api/v1/bookshelf/{bookshelfId}
   */
  getBookshelf: async (bookshelfId: number): Promise<Bookshelf> => {
    const response = await axiosGroo.get<{ data: Bookshelf }>(`/bookshelf/${bookshelfId}`);
    return response.data.data;
  },

  /**
   * 책장 생성
   * POST /api/v1/bookshelf
   */
  createBookshelf: async (data: BookshelfRequest): Promise<Bookshelf> => {
    const response = await axiosGroo.post<{ data: Bookshelf }>('/bookshelf', data);
    return response.data.data;
  },

  /**
   * 책장 수정
   * PUT /api/v1/bookshelf/{bookshelfId}
   */
  updateBookshelf: async (bookshelfId: number, data: BookshelfRequest): Promise<Bookshelf> => {
    const response = await axiosGroo.put<{ data: Bookshelf }>(`/bookshelf/${bookshelfId}`, data);
    return response.data.data;
  },

  /**
   * 책장 삭제
   * DELETE /api/v1/bookshelf/{bookshelfId}
   */
  deleteBookshelf: async (bookshelfId: number): Promise<null> => {
    const response = await axiosGroo.delete<{ data: null }>(`/bookshelf/${bookshelfId}`);
    return response.data.data;
  },

  // ================================
  // 도서 스크랩 관련 API (BookScrapController)
  // Base URL: /api/v1/book/scrap
  // ================================

  /**
   * 도서 스크랩 생성
   * POST /api/v1/book/scrap
   */
  createBookScrap: async (data: { bookshelfId: number; ISBN: string }): Promise<BookScrap> => {
    // 백엔드 DTO는 대문자 ISBN을 요구하므로 직접 변환
    const requestBody = {
      bookshelfId: data.bookshelfId,
      ISBN: data.ISBN // 반드시 대문자 ISBN
    };

    const response = await axiosGroo.post<{ data: BookScrap }>('/book/scrap', requestBody);
    return response.data.data;
  },

  /**
   * 책장 내 스크랩 도서 목록 조회
   * GET /api/v1/book/scrap/list/{bookshelfId}
   */
  getBookScrapList: async (bookshelfId: number): Promise<BookScrap[]> => {
    const response = await axiosGroo.get<{ data: BookScrap[] }>(`/book/scrap/list/${bookshelfId}`);
    return response.data.data;
  },

  /**
   * 도서 스크랩 단건 조회
   * GET /api/v1/book/scrap/{bookshelfId}/{ISBN}
   */
  getBookScrap: async (bookshelfId: number, ISBN: string): Promise<BookScrap> => {
    const response = await axiosGroo.get<{ data: BookScrap }>(`/book/scrap/${bookshelfId}/${ISBN}`);
    return response.data.data;
  },

  /**
   *  도서 스크랩 단건 삭제
   * DELETE /api/v1/book/scrap
   */
  deleteBookScrap: async (bookshelfId: number, ISBN: string): Promise<null> => {
    const requestBody = {
      bookshelfId: bookshelfId,
      ISBN: ISBN
    };

    const response = await axiosGroo.delete<{ data: null }>('/book/scrap', {
      data: requestBody
    });
    return response.data.data;
  },
  /**
   *  도서 스크랩 다중 삭제
   * DELETE /api/v1/book/scrap/{bookshelfId}
   */
  deleteBookScrapList: async (bookshelfId: number, isbnList: string[]): Promise<number> => {
    const response = await axiosGroo.delete<{ data: number }>(`/book/scrap/${bookshelfId}`, {
      data: { isbnList }
    });
    return response.data.data;
  },

  /**
   *  책장별 스크랩 도서 수 조회
   * GET /api/v1/book/scrap/count/{bookshelfId}
   */
  getBookScrapCount: async (bookshelfId: number): Promise<number> => {
    const response = await axiosGroo.get<{ data: number }>(`/book/scrap/count/${bookshelfId}`);
    return response.data.data;
  },

  /**
   *  책장명 목록 조회
   * (백엔드에 /bookshelf/names 엔드포인트 없으면 제거 가능)
   */
  getBookshelfNameList: async (): Promise<string[]> => {
    const response = await axiosGroo.get<{ data: string[] }>('/bookshelf/names');
    return response.data.data;
  }
};
