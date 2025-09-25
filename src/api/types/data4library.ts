export interface Data4LibraryBook {
  bookname: string;
  authors: string;
  publisher: string;
  publication_year: string;
  isbn13: string;
  class_no: string;
  class_nm: string;
  bookImageURL: string;
  bookDtlUrl: string;
}

export interface Data4LibrarySearchResponse {
  response: {
    request: {
      keyword: string;
      pageNo: number;
      pageSize: number;
    };
    numFound: number;
    docs: { doc: Data4LibraryBook }[];
  };
}
