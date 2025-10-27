import axiosLibrary from '@/apis/library/config';
import {
  CheckBookAvailabilityResDTO,
  GetLibrariesByISBNResDTO,
  GetHotTrendBooksResDTO,
  GetMonthlyKeywordsResDTO,
  GetNewArrivalBooksResDTO,
  GetRecommendBooksResDTO,
  GetLoanItemsByLibOrRegionResDTO,
  GetLibraryPopularBooksIntegratedResDTO,
  GetRegionalReadingStatsResDTO
} from '@/types';

export const fetchLibrary = {
  // 책 검색 API
  searchBooks: async (keyword: string, pageNo: number = 1, pageSize: number = 10) => {
    const response = await axiosLibrary.get('/srchBooks', {
      params: {
        keyword: encodeURIComponent(keyword),
        pageNo,
        pageSize
      }
    });
    return response;
  },

  // 인기대출도서 조회 API
  getPopularBooks: async (startDt: string, endDt: string, pageNo: number = 1, pageSize: number = 10) => {
    const response = await axiosLibrary.get('/loanItemSrch', {
      params: {
        startDt,
        endDt,
        pageNo,
        pageSize
      }
    });
    return response.data;
  },

  // 도서 상세 조회 API
  getBookDetail: async (isbn13: string, loaninfoYN: string = 'Y', displayInfo: string = 'age') => {
    const response = await axiosLibrary.get('/srchDtlList', {
      params: {
        isbn13,
        loaninfoYN,
        displayInfo
      }
    });
    return response.data;
  },

  // 정보공개 도서관 조회 API
  getLibraries: async (pageNo: number = 1, pageSize: number = 10, region?: string) => {
    const response = await axiosLibrary.get('/libSrch', {
      params: {
        pageNo,
        pageSize,
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

  // 도서관별 장서/대출 데이터 조회 API
  getLibraryItems: async (
    libCode: string,
    type: string = 'ALL',
    pageNo: number = 1,
    pageSize: number = 10
  ) => {
    const response = await axiosLibrary.get('/itemSrch', {
      params: {
        libCode,
        type,
        pageNo,
        pageSize
      }
    });
    return response.data;
  },

  // 마니아를 위한 추천도서 API
  getManiaRecommendBooks: async (isbn13: string): Promise<GetRecommendBooksResDTO> => {
    const response = await axiosLibrary.get('/recommandList', {
      params: {
        isbn13: isbn13
      }
    });
    return response.data;
  },

  // 다독자를 위한 추천도서 API
  getReaderRecommendBooks: async (isbn13: string): Promise<GetRecommendBooksResDTO> => {
    const response = await axiosLibrary.get('/recommandList', {
      params: {
        type: 'reader',
        isbn13
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

  // 도서관별 대출반납추이 API
  getLibraryUsageTrend: async (libCode: string, type: string = 'D') => {
    const response = await axiosLibrary.get('/usageTrend', {
      params: {
        libCode,
        type
      }
    });
    return response.data;
  },

  // 도서별 키워드 목록 API
  getBookKeywords: async (isbn13: string, additionalYN: string = 'Y') => {
    const response = await axiosLibrary.get('/keywordList', {
      params: {
        isbn13,
        additionalYN
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

  // 도서관별 통합정보 API
  getLibraryIntegratedInfo: async (pageNo: number = 1, pageSize: number = 10, region?: string) => {
    const response = await axiosLibrary.get('/extends/libSrch', {
      params: {
        pageNo,
        pageSize,
        region
      }
    });
    return response.data;
  },

  // 이달의 키워드 API
  getMonthlyKeywords: async (month?: string): Promise<GetMonthlyKeywordsResDTO> => {
    const response = await axiosLibrary.get('/monthlyKeywords', {
      params: {
        month
      }
    });
    return response.data;
  },

  // 지역별 독서량/독서율 API
  getRegionalReadingStats: async () => {
    const regions = [
      { code: '11', name: '서울' },
      { code: '21', name: '부산' },
      { code: '22', name: '대구' },
      { code: '23', name: '인천' },
      { code: '24', name: '광주' },
      { code: '25', name: '대전' },
      { code: '26', name: '울산' },
      { code: '29', name: '세종' },
      { code: '31', name: '경기' },
      { code: '32', name: '강원' },
      { code: '33', name: '충북' },
      { code: '34', name: '충남' },
      { code: '35', name: '전북' },
      { code: '36', name: '전남' },
      { code: '37', name: '경북' },
      { code: '38', name: '경남' },
      { code: '39', name: '제주' }
    ];

    const requests = regions.map(async (r) => {
      try {
        const res = await axiosLibrary.get('/readQt', {
          params: { region: r.code, format: 'json' }
        });

        // 로그 1: 지역별 원본 응답 확인
        console.log(`[READ_QT][${r.name}]`, res.data);

        const item = res?.data?.response?.results?.[0]?.result;
        if (!item) {
          console.warn(`[READ_QT][${r.name}] result 없음`);
          return null;
        }

        const parsed = {
          region: r.name,
          quantity: parseFloat(item.quantity ?? 0),
          rate: parseFloat(item.rate ?? 0)
        };

        // 로그 2: 지역별 변환 결과
        console.log(`[READ_QT_PARSED][${r.name}]`, parsed);
        return parsed;
      } catch (e) {
        console.error(`[READ_QT_ERROR][${r.name}]`, e);
        return null;
      }
    });

    const results = await Promise.all(requests);
    console.log(' [READ_QT_ALL_RESULTS]', results);
    return results.filter(Boolean);
  },

  // 신착도서 조회 API
  getNewArrivalBooks: async (libCode: string, searchDt?: string): Promise<GetNewArrivalBooksResDTO> => {
    const response = await axiosLibrary.get('/newArrivalBook', {
      params: {
        libCode,
        searchDt
      }
    });
    return response.data;
  },

  // 도서관/지역별 인기대출 도서 조회 API
  getLoanItemsByLibOrRegion: async (
    libCode?: string,
    region?: string,
    dtl_region?: string,
    startDt?: string,
    endDt?: string,
    gender?: string,
    age?: string,
    pageNo: number = 1,
    pageSize: number = 10
  ): Promise<GetLoanItemsByLibOrRegionResDTO> => {
    const response = await axiosLibrary.get('/loanItemSrchByLib', {
      params: {
        libCode,
        region,
        dtl_region,
        startDt,
        endDt,
        gender,
        age,
        pageNo,
        pageSize
      }
    });
    return response.data;
  },

  // 도서관별 인기대출도서 통합 API
  getLibraryPopularBooksIntegrated: async (
    libCode: string
  ): Promise<GetLibraryPopularBooksIntegratedResDTO> => {
    const response = await axiosLibrary.get('/extends/loanItemSrchByLib', {
      params: {
        libCode
      }
    });
    return response.data;
  }
};
