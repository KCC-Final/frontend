/** 알라딘 API 베스트셀러 리스트의 개별 아이템 타입 */
export interface AladinBestsellerItem {
  title: string;
  author: string;
  pubDate: string;
  description: string;
  isbn: string;
  isbn13: string;
  itemId: number;
  priceSales: number;
  priceStandard: number;
  mallType: string;
  stockStatus: string;
  mileage: number;
  cover: string;
  categoryId: number;
  categoryName: string;
  publisher: string;
  salesPoint: number;
  adult: boolean;
  fixedPrice: boolean;
  customerReviewRank: number;
  bestRank: number;
  seriesInfo?: {
    seriesId: number;
    seriesLink: string;
    seriesName: string;
  };
}

/** 알라딘 API 베스트셀러 리스트 응답 전체 타입 */
export interface AladinBestsellerResDTO {
  version: string;
  title: string;
  link: string;
  pubDate: string;
  totalResults: number;
  startIndex: number;
  itemsPerPage: number;
  query: string;
  searchCategoryId: number;
  searchCategoryName: string;
  item: AladinBestsellerItem[];
}

/** 알라딘 API 도서 검색 결과의 부가 정보 타입 */
export interface AladinBookDetailsSubInfo {
  subTitle: string;
  originalTitle: string;
  itemPage: number;
  phraseList: {
    pageNo: string;
    phrase: string;
  }[];
}

/** 알라딘 API 도서 검색 결과의 개별 아이템 타입 */
export interface AladinBookDetailsItem {
  title: string;
  link: string;
  author: string;
  pubDate: string;
  description: string;
  isbn: string;
  isbn13: string;
  itemId: number;
  priceSales: number;
  priceStandard: number;
  mallType: string;
  stockStatus: string;
  mileage: number;
  cover: string;
  categoryId: number;
  categoryName: string;
  publisher: string;
  salesPoint: number;
  adult: boolean;
  fixedPrice: boolean;
  customerReviewRank: number;
  subInfo: AladinBookDetailsSubInfo;
}

/** 알라딘 API 도서 검색 응답 전체 타입 */
export interface AladinBookDetailsResDTO {
  version: string;
  logo: string;
  title: string;
  link: string;
  pubDate: string;
  totalResults: number;
  startIndex: number;
  itemsPerPage: number;
  query: string;
  searchCategoryId: number;
  searchCategoryName: string;
  item: AladinBookDetailsItem[];
}
