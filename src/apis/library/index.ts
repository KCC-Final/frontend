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

function ensurePeriod(startDt?: string, endDt?: string) {
  if (startDt && endDt) return { startDt, endDt };

  const end = new Date();
  const start = new Date();
  start.setMonth(end.getMonth() - 3);

  return {
    startDt: startDt ?? start.toISOString().slice(0, 10),
    endDt: endDt ?? end.toISOString().slice(0, 10)
  };
}

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

  // 인기대출도서 조회 API (기존 방식 유지)
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
  getRegionalReadingRaw: async (regionCode: string) => {
    const res = await axiosLibrary.get('/readQt', {
      params: { region: regionCode, format: 'json' }
    });
    return res.data; // 원본 그대로 반환
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

  getLoanItemsByLibOrRegion: async (
    libCode?: string,
    region?: string,
    dtl_region?: string,
    startDt?: string,
    endDt?: string,
    gender?: string,
    age?: string,
    pageNo: number = 1,
    pageSize: number = 200
  ): Promise<GetLoanItemsByLibOrRegionResDTO> => {
    const { startDt: start, endDt: end } = ensurePeriod(startDt, endDt);

    // 파라미터 구성
    const params: any = {
      startDt: start,
      endDt: end,
      pageNo,
      pageSize
    };

    // 선택적 파라미터 추가 (값이 있을 때만)
    if (gender) params.gender = gender;
    if (age) params.age = age;
    if (region) params.region = region;
    if (dtl_region) params.dtl_region = dtl_region;
    if (libCode) params.libCode = libCode;

    // API 엔드포인트 결정
    // libCode가 있으면 도서관별 조회, 없으면 지역/전국 조회
    const endpoint = libCode ? '/loanItemSrchByLib' : '/loanItemSrch';

    console.log('[Library API] 호출:', endpoint, params);

    const response = await axiosLibrary.get(endpoint, { params });
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
  },

  getLoanItemsAll: async (params: {
    startDt?: string;
    endDt?: string;
    gender?: string;
    age?: string;
    pageNo?: number;
    pageSize?: number;
  }): Promise<GetLoanItemsByLibOrRegionResDTO> => {
    return await fetchLibrary.getLoanItemsByLibOrRegion(
      undefined, // libCode
      undefined, // region
      undefined, // dtl_region
      params.startDt,
      params.endDt,
      params.gender,
      params.age,
      params.pageNo ?? 1,
      params.pageSize ?? 200
    );
  },

  getLoanItemsByRegion: async (params: {
    region: string | string[];
    dtl_region?: string | string[];
    startDt?: string;
    endDt?: string;
    gender?: string;
    age?: string;
    pageNo?: number;
    pageSize?: number;
  }): Promise<GetLoanItemsByLibOrRegionResDTO> => {
    // 다중 지역 처리 (세미콜론으로 구분)
    const region = Array.isArray(params.region) ? params.region.join(';') : params.region;

    const dtl_region = Array.isArray(params.dtl_region) ? params.dtl_region.join(';') : params.dtl_region;

    return await fetchLibrary.getLoanItemsByLibOrRegion(
      undefined, // libCode
      region,
      dtl_region,
      params.startDt,
      params.endDt,
      params.gender,
      params.age,
      params.pageNo ?? 1,
      params.pageSize ?? 200
    );
  }
};
