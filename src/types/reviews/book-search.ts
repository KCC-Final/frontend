// 알라딘 도서 검색 결과
export type AladinBook = {
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
  customerReviewRank: number;
  link: string;
};

// 정보나루 도서 상세
export type LibraryBook = {
  bookname: string;
  authors: string;
  publisher: string;
  publication_year: string;
  isbn13: string;
  class_no: string;
  class_nm: string;
  bookImageURL: string;
  loan_count: string;
};

// 도서 검색 모달 상태
export type BookSearchState = {
  keyword: string;
  searchResults: AladinBook[];
  isLoading: boolean;
  hasSearched: boolean;
};

// 선택된 도서 정보
export type SelectedBookInfo = {
  aladinBook: AladinBook | null;
  libraryBook: LibraryBook | null;
  codeId: number | null;
};
