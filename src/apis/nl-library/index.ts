// 1. 외부 라이브러리 (npm)
import { XMLParser } from 'fast-xml-parser';

// 2. 내부 설정 및 타입
import axiosNLLibrary from './config';

import { GetLibrarianRecommendBooksResDTO, CategoryCode } from '@/types/nl-library';
import { devLogger } from '@/utils/dev-logger';

// 3. XML Parser 인스턴스 (fast-xml-parser 5.x 기준)
const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '',
  removeNSPrefix: true
});

export const fetchNLLibrary = {
  async getLibrarianRecommendBooks(
    startRowNumApi: number = 1,
    endRowNumApi: number = 10,
    start_date?: string,
    end_date?: string,
    drCode?: CategoryCode
  ): Promise<GetLibrarianRecommendBooksResDTO> {
    try {
      const response = await axiosNLLibrary.get<string>('/NL/search/openApi/saseoApi.do', {
        params: {
          startRowNumApi,
          endRowNumApi,
          start_date,
          end_date,
          drCode
        }
      });

      // XML → JSON 변환
      const parsed = parser.parse(response.data) as GetLibrarianRecommendBooksResDTO;

      return parsed;
    } catch (error: unknown) {
      const status = (error as any)?.response?.status ?? 'Unknown';
      throw new Error('국립중앙도서관 데이터 요청에 실패했습니다.');
    }
  }
};
