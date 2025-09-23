// 📁 src/api/constants/index.ts
export const API_CONSTANTS = {
  // 알라딘 API 관련
  ALADIN: {
    QUERY_TYPES: {
      TITLE: 'Title',
      AUTHOR: 'Author',
      PUBLISHER: 'Publisher',
      KEYWORD: 'Keyword'
    } as const,

    SEARCH_TARGETS: {
      BOOK: 'Book',
      FOREIGN: 'Foreign',
      MUSIC: 'Music',
      DVD: 'DVD',
      USED: 'Used',
      EBOOK: 'eBook',
      ALL: 'All'
    } as const,

    COVER_SIZES: {
      BIG: 'Big',
      MID_BIG: 'MidBig',
      MID: 'Mid',
      SMALL: 'Small',
      MINI: 'Mini',
      NONE: 'None'
    } as const,

    SORT_OPTIONS: {
      ACCURACY: 'Accuracy',
      PUBLISH_TIME: 'PublishTime',
      TITLE: 'Title',
      SALES_POINT: 'SalesPoint',
      CUSTOMER_RATING: 'CustomerRating'
    } as const
  },

  // 공통 상수
  COMMON: {
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 100,
    DEFAULT_TIMEOUT: 10000,
    MAX_RETRIES: 3,
    DEBOUNCE_DELAY: 300
  } as const,

  // HTTP 상태 코드
  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
  } as const,

  // 에러 메시지
  ERROR_MESSAGES: {
    NETWORK_ERROR: '네트워크 연결을 확인해주세요.',
    TIMEOUT_ERROR: '요청 시간이 초과되었습니다.',
    UNAUTHORIZED: '로그인이 필요합니다.',
    FORBIDDEN: '접근 권한이 없습니다.',
    NOT_FOUND: '요청한 데이터를 찾을 수 없습니다.',
    SERVER_ERROR: '서버 오류가 발생했습니다.',
    UNKNOWN_ERROR: '알 수 없는 오류가 발생했습니다.'
  } as const
} as const;

// 타입 추출
export type AladinQueryType =
  (typeof API_CONSTANTS.ALADIN.QUERY_TYPES)[keyof typeof API_CONSTANTS.ALADIN.QUERY_TYPES];
export type AladinSearchTarget =
  (typeof API_CONSTANTS.ALADIN.SEARCH_TARGETS)[keyof typeof API_CONSTANTS.ALADIN.SEARCH_TARGETS];
