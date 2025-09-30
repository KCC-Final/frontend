import axiosLibrary from '@/apis/library/config';

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
  getHotTrendBooks: async (searchDt: string) => {
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
  getManiaRecommendBooks: async (isbn13: string) => {
    const response = await axiosLibrary.get('/recommandList', {
      params: {
        isbn13: isbn13
      }
    });
    return response.data;
  },

  // 다독자를 위한 추천도서 API
  getReaderRecommendBooks: async (isbn13: string) => {
    const response = await axiosLibrary.get('/recommandList', {
      params: {
        type: 'reader',
        isbn13
      }
    });
    return response.data;
  },

  // 도서 소장 도서관 조회 API
  getLibrariesByBook: async (isbn: string, region: string, pageNo: number = 1, pageSize: number = 10) => {
    const response = await axiosLibrary.get('/libSrchByBook', {
      params: {
        isbn,
        region,
        pageNo,
        pageSize
      }
    });
    return response.data;
  },

  // 도서관별 도서 소장여부 및 대출 가능여부 조회 API
  checkBookAvailability: async (libCode: string, isbn13: string) => {
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
  getMonthlyKeywords: async (month?: string) => {
    const response = await axiosLibrary.get('/monthlyKeywords', {
      params: {
        month
      }
    });
    return response.data;
  },

  // 지역별 독서량/독서율 API
  getRegionalReadingStats: async (region?: string, year?: string, month?: string) => {
    const response = await axiosLibrary.get('/readQt', {
      params: {
        region,
        year,
        month
      }
    });
    return response.data;
  },

  // 신착도서 조회 API
  getNewArrivalBooks: async (libCode: string, searchDt?: string) => {
    const response = await axiosLibrary.get('/newArrivalBook', {
      params: {
        libCode,
        searchDt
      }
    });
    return response.data;
  }
};
