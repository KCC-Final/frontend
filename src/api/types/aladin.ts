// 📁 src/api/types/aladin.ts
export interface AladinBook {
  title: string;
  author: string;
  publisher: string;
  pubDate: string;
  description: string;
  isbn: string;
  isbn13: string;
  priceSales: number;
  priceStandard: number;
  mallType: string;
  cover: string;
  categoryId: number;
  categoryName: string;
  customerReviewRank: number;
  bestRank?: number;
  salesPoint?: number;
  mileage?: number;
  stockstatus?: string;
  adult?: boolean;
  fixedPrice?: boolean;
  link?: string;
}

export interface AladinSearchParams {
  query: string;
  queryType?: 'Title' | 'Author' | 'Publisher' | 'Keyword';
  maxResults?: number;
  start?: number;
  searchTarget?: 'Book' | 'Foreign' | 'Music' | 'DVD' | 'Used' | 'eBook' | 'All';
  sort?: 'Accuracy' | 'PublishTime' | 'Title' | 'SalesPoint' | 'CustomerRating';
  cover?: 'Big' | 'MidBig' | 'Mid' | 'Small' | 'Mini' | 'None';
  categoryId?: number;
}

export interface AladinListParams {
  queryType: 'ItemNewAll' | 'ItemNewSpecial' | 'ItemEditorChoice' | 'Bestseller' | 'BlogBest';
  maxResults?: number;
  start?: number;
  searchTarget?: string;
  categoryId?: number;
}

export interface AladinDetailParams {
  itemId: string;
  itemIdType?: 'ISBN' | 'ISBN13' | 'ItemId';
  cover?: string;
  optResult?: string;
}
