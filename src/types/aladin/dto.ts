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
