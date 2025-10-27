// ===============================================
//  국립중앙도서관 API (사서추천도서) - 완성본
// ===============================================
import { XMLParser } from 'fast-xml-parser';

import axiosNLLibrary from './config';

// 1️⃣ 외부 라이브러리 (npm)

// 2️⃣ 내부 유틸 / 타입
import { GetLibrarianRecommendBooksResDTO, CategoryCode } from '@/types/nl-library';
import { devLogger } from '@/utils/dev-logger';

// 3️⃣ XML Parser 인스턴스 (fast-xml-parser 5.x 기준)
const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '',
  removeNSPrefix: true
});

export const fetchNLLibrary = {
  /**
   * 국립중앙도서관 사서 추천도서 조회 API
   * @param startRowNumApi 시작번호 (1부터 시작)
   * @param endRowNumApi 종료번호
   * @param start_date 검색 시작일 (YYYYMMDD)
   * @param end_date 검색 종료일 (YYYYMMDD)
   * @param drCode 분류번호 (11:문학, 6:인문과학, 5:사회과학, 4:자연과학)
   */
  async getLibrarianRecommendBooks(
    startRowNumApi: number = 1,
    endRowNumApi: number = 10,
    start_date?: string,
    end_date?: string,
    drCode?: CategoryCode
  ): Promise<GetLibrarianRecommendBooksResDTO> {
    try {
      //  요청 로깅

      const response = await axiosNLLibrary.get<string>('/NL/search/openApi/saseoApi.do', {
        params: {
          startRowNumApi,
          endRowNumApi,
          start_date,
          end_date,
          drCode
        }
      });

      //  XML → JSON 변환
      const parsed = parser.parse(response.data) as GetLibrarianRecommendBooksResDTO;

      return parsed;
    } catch (error: unknown) {
      const status = (error as any)?.response?.status ?? 'Unknown';
      throw new Error('국립중앙도서관 데이터 요청에 실패했습니다.');
    }
  }
};
