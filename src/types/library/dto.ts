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

/** 대출 급상승 도서 API 응답 타입 */
export interface GetHotTrendBooksResDTO {
  response: {
    results: {
      result: Array<{
        date: string;
        docs: {
          doc: Array<{
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
          }>;
        };
      }>;
    };
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

/* ============================
    국립중앙도서관 (NL Library)
   - /NL/search/openApi/saseoApi.do
============================ */

/** 사서추천도서 개별 아이템 */
export interface LibrarianRecommendBook {
  recomNo: string; // 추천 도서 고유번호
  recomtitle: string; // 제목
  recomauthor: string; // 저자
  recompublisher: string; // 출판사
  recomisbn: string; // ISBN
  recomYear: string; // 추천연도
  recomMonth: string; // 추천월
  drCodeName: string; // 분류명 (예: 문학)
  recomfilepath?: string; // 표지 이미지 URL
  publishYear?: string; // 출판년도
}

/** 국립중앙도서관 사서추천도서 API 응답 */
export interface GetLibrarianRecommendBooksResDTO {
  channel: {
    result: string;
    resultNum: number;
    totalCount: number;
    list: {
      item: LibrarianRecommendBook[];
    };
  };
}
