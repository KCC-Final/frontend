/* ============================
    도서관정보나루 (Data4Library)
============================ */
export interface Library {
  libCode: string;
  libName: string;
  address: string;
  tel: string;
  fax: string;
  latitude: string;
  longitude: string;
  homepage: string;
  closed: string;
  operatingTime: string;
}

/** ISBN과 지역으로 도서관 목록을 조회하는 API의 응답 타입 */
export interface GetLibrariesByISBNResDTO {
  response: {
    pageNo: string;
    pageSize: string;
    numFound: number;
    resultNum: number;
    libs: { lib: Library }[];
  };
}

export interface CheckBookAvailabilityResult {
  hasBook: 'Y' | 'N';
  loanAvailable: 'Y' | 'N';
}

/** ISBN과 도서관 식별값으로 도서 대출 가능 여부 조회 API의 응답 타입 */
export interface CheckBookAvailabilityResDTO {
  response: {
    request: {
      isbn13: string;
      libCode: string;
    };
    result: CheckBookAvailabilityResult;
  };
}

export interface LibraryWithAvailability extends Library {
  availability?: CheckBookAvailabilityResult;
}

/** 기본 도서 정보 인터페이스 */
export interface Book {
  no?: number;
  ranking?: number;
  bookname: string;
  authors: string;
  publisher: string;
  publication_year: string;
  isbn13: string;
  addition_symbol?: string;
  vol?: string;
  class_no: string;
  class_nm: string;
  bookImageURL: string;
  bookDtlUrl?: string;
  loan_count?: number;
}

/**
 * 대출 급상승 도서 API 응답 타입 (최종 수정)
 * @author uyh
 */
export interface GetHotTrendBooksResDTO {
  response: {
    request: {
      searchDt: string;
    };
    results: Array<{
      result: {
        date: string;
        docs: Array<{
          // docs는 배열
          doc: {
            // 각 요소가 {doc: {...}} 형태
            no: number;
            difference: number;
            baseWeekRank: number;
            pastWeekRank: number;
            bookname: string;
            authors: string;
            publisher: string;
            publication_year: string;
            isbn13: string;
            addition_symbol: string;
            vol: string;
            class_no: string;
            class_nm: string;
            bookImageURL: string;
            bookDtlUrl: string;
          };
        }>;
      };
    }>;
  };
}
/** 이달의 키워드 API 응답 타입 */
export interface GetMonthlyKeywordsResDTO {
  response: {
    keywords: {
      keyword: Array<{
        word: string;
        weight: number;
      }>;
    };
  };
}

/** 신착도서 조회 API 응답 타입 */
export interface GetNewArrivalBooksResDTO {
  response: {
    libNm: string;
    pageNo: string;
    pageSize: string;
    numFound: number;
    resultNum: number;
    docs: {
      doc: Array<{
        bookname: string;
        authors: string;
        publisher: string;
        publication_year: string;
        isbn13: string;
        set_isbn13?: string;
        bookImageURL: string;
        addition_symbol: string;
        vol: string;
        class_no: string;
        class_nm: string;
        reg_date: string;
      }>;
    };
  };
}

/** 추천도서 API 응답 타입 (마니아/다독자 공통) */
export interface GetRecommendBooksResDTO {
  response: {
    resultNum: number;
    docs: {
      book: Array<{
        no: number;
        bookname: string;
        authors: string;
        publisher: string;
        publication_year: string;
        isbn13: string;
        addition_symbol: string;
        vol: string;
        class_no: string;
        class_nm: string;
        bookImageURL: string;
      }>;
    };
  };
}

/** 도서관/지역별 인기대출 도서 조회 API 응답 타입 */
export interface GetLoanItemsByLibOrRegionResDTO {
  response: {
    libNm?: string;
    regionNm?: string;
    dtlregionNm?: string;
    resultNum: number;
    docs: {
      doc: Array<{
        no: number;
        ranking: number;
        bookname: string;
        authors: string;
        publisher: string;
        publication_year: string;
        isbn13: string;
        addition_symbol: string;
        vol: string;
        class_no: string;
        class_nm: string;
        bookImageURL: string;
        bookDtlUrl: string;
        loan_count?: number;
      }>;
    };
  };
}

/** 도서관별 인기대출도서 통합 API 응답 타입 */
export interface GetLibraryPopularBooksIntegratedResDTO {
  response: {
    loanBooks: { book: Book[] };
    age0Books: { book: Book[] };
    age6Books: { book: Book[] };
    age8Books: { book: Book[] };
    age14Books: { book: Book[] };
    age20Books: { book: Book[] };
  };
}

/** 지역별 독서량/독서율 API 응답 타입 */
export interface GetRegionalReadingStatsResDTO {
  response: {
    results: {
      result: Array<{
        age: string;
        quantity: number;
        rate: number;
      }>;
    };
  };
}

/**
 * 도서별 이용 분석 API 응답 타입
 * @author uyh
 */
export type BookUsageAnalysisResDTO = {
  response: {
    request: {
      isbn13: string;
    };
    resultNum: number;
    docs: {
      doc: {
        bookname: string;
        authors: string;
        publisher: string;
        publication_year: string;
        isbn13: string;
        vol: string;
        class_no: string;
        class_nm: string;
        loan_count: string;
        bookImageURL: string;
        bookDtlUrl: string;
        loanGrps: {
          loanGrp: LoanGroup[];
        };
      };
    };
    // 대출 추이 데이터 추가
    loanHistory?: Array<{
      loan: {
        month: string; // '2024년 10월' 형식
        loanCnt: number;
        ranking: number;
      };
    }>;
  };
};

export type LoanGroup = {
  age: string;
  gender: string;
  loanCnt: number;
  ranking: number;
};

/**
 * 차트 표시용 가공 데이터 타입
 */
export type AgeGenderChartData = {
  age: string;
  male: number;
  female: number;
};

/**
 * 최다 회원 정보 (1위, 2위)
 */
export type TopReaderInfo = {
  rank: number;
  gender: '남성' | '여성';
  ageGroup: string;
  percentage: number;
};

/**
 * 도서관별 대출반납추이 API 응답 타입
 * @author uyh
 */
export interface GetLibraryUsageTrendResDTO {
  response: {
    request: {
      libCode: string;
      type: string;
    };
    result: {
      loanhistory: Array<{
        loanDate: string;
        loanCnt: number;
      }>;
    };
  };
}

/**
 * 대출추이 차트용 데이터 타입
 * @author uyh
 */
export type LoanTrendChartData = {
  month: string; // 원본 월 데이터
  count: number;
  formattedMonth: string; // 표시용
};
// dto.ts
// Data4Library: loanItemSrch / loanItemSrchByLib 공통 응답 DTO (docs/doc 형태 모두 대응)

export interface LoanItemDoc {
  no?: number | string;
  ranking?: number | string;
  bookname: string;
  authors?: string;
  publisher?: string;
  publication_year?: string;
  isbn13: string;
  addition_symbol?: string;
  vol?: string;
  class_no?: string;
  class_nm?: string;
  bookImageURL?: string;
  bookDtlUrl?: string;
  loan_count?: number | string;
}

export type DocsShape =
  | LoanItemDoc[] // docs: []
  | { doc: LoanItemDoc[] } // docs: { doc: [] }
  | { doc: LoanItemDoc } // docs: { doc: {} }
  | LoanItemDoc; // docs: {}

export interface LoanItemsResponse {
  response?: {
    resultNum?: number | string;
    numFound?: number | string;
    docs?: DocsShape;
  };
  // 간혹 최상위에 docs가 오는 사례까지 방어
  docs?: DocsShape;
}

// 안전 파서
export function extractLoanDocs(payload: LoanItemsResponse): LoanItemDoc[] {
  const target = payload?.response?.docs ?? payload?.docs;
  if (!target) return [];

  // 배열 그대로
  if (Array.isArray(target)) return target as LoanItemDoc[];

  // { doc: [...] } or { doc: {...} }
  const maybeDoc: any = (target as any).doc;
  if (Array.isArray(maybeDoc)) return maybeDoc as LoanItemDoc[];
  if (maybeDoc) return [maybeDoc as LoanItemDoc];

  // 최후 보루: 단일 객체로 가정
  return [target as LoanItemDoc];
}
