import axiosLibrary from '@/apis/library/config';
import { CheckBookAvailabilityResDTO, GetLibrariesByISBNResDTO, GetHotTrendBooksResDTO } from '@/types';

export const fetchLibrary = {
  // 인기대출도서 조회 API
  getPopularBooks: async (
    startDt: string,
    endDt: string,
    pageNo: number = 1,
    pageSize: number = 10,
    gender?: string,
    age?: string,
    region?: string
  ) => {
    const response = await axiosLibrary.get('/loanItemSrch', {
      params: {
        startDt,
        endDt,
        pageNo,
        pageSize,
        gender,
        age,
        region
      }
    });
    return response.data;
  },

  // 대출 급상승 도서 API
  getHotTrendBooks: async (searchDt: string): Promise<GetHotTrendBooksResDTO> => {
    const response = await axiosLibrary.get('/hotTrend', {
      params: {
        searchDt
      }
    });
    return response.data;
  },

  // 도서 소장 도서관 조회 API
  getLibrariesByISBN: async (
    isbn: string,
    region: string,
    dtl_region?: string,
    pageNo: number = 1,
    pageSize: number = 10
  ): Promise<GetLibrariesByISBNResDTO> => {
    const response = await axiosLibrary.get('/libSrchByBook', {
      params: {
        isbn,
        region,
        dtl_region,
        pageNo,
        pageSize
      }
    });
    return response.data;
  },

  // 도서관별 도서 소장여부 및 대출 가능여부 조회 API
  checkBookAvailability: async (libCode: string, isbn13: string): Promise<CheckBookAvailabilityResDTO> => {
    const response = await axiosLibrary.get('/bookExist', {
      params: {
        libCode,
        isbn13
      }
    });
    return response.data;
  },

  // 도서별 이용 분석 API
  getBookUsageAnalysis: async (isbn13: string) => {
    const response = await axiosLibrary.get('/usageAnalysisList', {
      params: {
        isbn13
      }
    });
    return response.data;
  },

  // 지역별 독서량/독서율 API
  getRegionalReadingRaw: async (region: string) => {
    const res = await axiosLibrary.get('/readQt', {
      params: { region }
    });
    return res.data; // 원본 그대로 반환
  }
};
