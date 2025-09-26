import axios from 'axios';

const libraryApiBaseURL = process.env.NEXT_PUBLIC_LIBRARY_API_URL;

const axiosLibrary = axios.create({
  baseURL: libraryApiBaseURL,
  withCredentials: true
});

// TODO: 사용하는 API가 확정이 안되어서 작성X (아래 주석은 알라딘 API 예시코드)

// export const fetchLibrary = {
//   /**
//    * 도서 검색
//    * @param search 검색어
//    * @returns
//    */
//   searchBooks: async (search: string) => {
//     const response = await axiosLibrary.get(`/search?query=${search}`);
//     return response.data;
//   },

//   /**
//    * 도서 상세정보 조회
//    * @param ISBN 책 ISBN값
//    * @returns
//    */
//   getBookDetails: async (ISBN: string) => {
//     const response = await axiosLibrary.get(`/detail?isbn13=${ISBN}`);
//     return response.data;
//   },

//   /**
//    * 베스트셀러 도서 조회
//    * @param count 조회할 도서수
//    * @returns
//    */
//   getBestSellers: async (count: number = 10) => {
//     const response = await axiosLibrary.get(`/bestseller?maxResults=${count}`);
//     return response.data;
//   }
// };
