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
