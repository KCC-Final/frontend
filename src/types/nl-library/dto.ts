/** 사서 추천도서 아이템 */
export interface LibrarianRecommendBook {
  recomNo: string;
  drCode: string;
  drCodeName: string;
  recomtitle: string;
  recomauthor: string;
  recompublisher: string;
  recomcallno: string;
  recomisbn: string;
  recomfilepath: string;
  recommokcha: string;
  recomcontens: string;
  regdate: string;
  controlNo: string;
  publishYear: string;
  recomYear: string;
  recomMonth: string;
  mokchFilePath: string;
}

/** 사서 추천도서 조회 API 응답 타입 */
export interface GetLibrarianRecommendBooksResDTO {
  channel: {
    totalCount: number;
    list: {
      item: LibrarianRecommendBook[];
    };
  };
}

/** 분류 코드 타입 */
export type CategoryCode = '11' | '6' | '5' | '4';

/** 분류 코드 맵 */
export const CATEGORY_CODE_MAP = {
  '11': '문학',
  '6': '인문과학',
  '5': '사회과학',
  '4': '자연과학'
} as const;
