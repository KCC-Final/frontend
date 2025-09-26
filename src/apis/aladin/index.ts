import axios from 'axios';

const aladinApiBaseURL = process.env.NEXT_PUBLIC_ALADIN_API_URL;

const axiosAladin = axios.create({
  baseURL: aladinApiBaseURL,
  withCredentials: true
});

export const fetchAladin = {
  /**
   * 도서 검색
   * @param search 검색어
   * @returns
   */
  searchBooks: async (search: string) => {
    const response = await axiosAladin.get(`/search?query=${search}`);
    return response.data;
  },

  /**
   * 도서 상세정보 조회
   * @param ISBN 책 ISBN값
   * @returns
   */
  getBookDetails: async (ISBN: string) => {
    const response = await axiosAladin.get(`/detail?isbn13=${ISBN}`);
    return response.data;
  },

  /**
   * 베스트셀러 도서 조회
   * @param count 조회할 도서수
   * @returns
   */
  getBestSellers: async (count: number = 10) => {
    const response = await axiosAladin.get(`/bestseller?maxResults=${count}`);
    return response.data;
  }
};
