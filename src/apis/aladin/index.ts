import axiosAladin from '@/apis/aladin/config';
import { AladinBestsellerResDTO, AladinBookDetailsResDTO } from '@/types';

export const fetchAladin = {
  /**
   * 알라딘 도서 검색
   * @param Query 검색어
   * @param MaxResults 조회할 도서수
   */
  searchBooks: async (Query: string, MaxResults: number = 10) => {
    const response = await axiosAladin.get('/ItemSearch.aspx', {
      params: {
        Query,
        QueryType: 'Title',
        MaxResults,
        start: 1,
        SearchTarget: 'Book',
        Cover: 'Big'
      }
    });
    return response.data;
  },

  /**
   * 알라딘 도서 상세정보 조회
   * @param ISBN 책 ISBN값
   * @returns
   */
  getBookDetails: async (ISBN: string): Promise<AladinBookDetailsResDTO> => {
    const response = await axiosAladin.get('/ItemLookUp.aspx', {
      params: {
        itemIdType: 'ISBN13',
        ItemId: ISBN,
        Cover: 'Big'
      }
    });
    return response.data;
  },

  /**
   * 알라딘 베스트셀러 도서 조회
   * @param MaxResults 조회할 도서수
   * @returns
   */
  getBestSellers: async (MaxResults: number = 10): Promise<AladinBestsellerResDTO> => {
    const response = await axiosAladin.get('/ItemList.aspx', {
      params: {
        QueryType: 'Bestseller',
        MaxResults,
        start: 1,
        SearchTarget: 'Book',
        Cover: 'Big'
      }
    });
    return response.data;
  }
};
