export interface GetPopularBooksReqQuery {
  gender?: string;
  age?: string;
  region?: string;
  to_age?: number;
  from_age?: number;
}

export interface BookLoanInfo {
  no: number;
  ranking: string;
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
  loan_count: string;
}

/** 도서관 정보나루 인기 대출 도서 API의 전체 응답 */
export interface GetPopularBooksResDTO {
  response: {
    request: unknown;
    resultNum: number;
    numFound: number;
    docs: { doc: BookLoanInfo }[];
  };
}

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

export interface BookDoc {
  no: number;
  difference: number;
  baseWeekRank: number;
  pastWeekRank: number;
  bookname: string;
  authors: string;
  publisher: string;
  publication_year: string;
  isbn13: string;
  bookImageURL: string;
}

export interface GetHotTrendBooksResDTO {
  response: {
    request: {
      searchDt: string;
    };
    results: {
      result: {
        date: string;
        docs: { doc: BookDoc }[];
      };
    }[];
  };
}
