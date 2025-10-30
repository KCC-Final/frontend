import { regionList } from '@/types/common/region';

export type FilterOption = {
  code: string;
  name: string;
  apiCode: string;
};

// ---------------------------------------
// 지역 옵션
// ---------------------------------------
const REGION_NAME_MAP: Record<string, string> = {
  서울특별시: '서울',
  부산광역시: '부산',
  대구광역시: '대구',
  인천광역시: '인천',
  광주광역시: '광주',
  대전광역시: '대전',
  울산광역시: '울산',
  세종특별자치시: '세종',
  경기도: '경기',
  강원특별자치도: '강원',
  충청북도: '충북',
  충청남도: '충남',
  전북특별자치도: '전북',
  전라남도: '전남',
  경상북도: '경북',
  경상남도: '경남',
  제주특별자치도: '제주'
};

export const REGION_OPTIONS: FilterOption[] = [
  { code: 'all', name: '전국', apiCode: 'all' },
  ...regionList.map((r) => ({
    code: r.code,
    name: REGION_NAME_MAP[r.name] || r.name,
    apiCode: r.code
  }))
];

// ---------------------------------------
// 연령 옵션 (age 코드 기반)
// ---------------------------------------
export const AGE_OPTIONS: FilterOption[] = [
  { code: 'all', name: '전체', apiCode: '' },
  { code: '0', name: '영유아(0~5세)', apiCode: '0' },
  { code: '6', name: '유아(6~7세)', apiCode: '6' },
  { code: '8', name: '초등(8~13세)', apiCode: '8' },
  { code: '14', name: '청소년(14~19세)', apiCode: '14' },
  { code: '20', name: '20대', apiCode: '20' },
  { code: '30', name: '30대', apiCode: '30' },
  { code: '40', name: '40대', apiCode: '40' },
  { code: '50', name: '50대', apiCode: '50' },
  { code: '60', name: '60세 이상', apiCode: '60' },
  { code: '-1', name: '미상', apiCode: '-1' }
];

// ---------------------------------------
// 성별 옵션 (gender 코드 기반)
// ---------------------------------------
export const GENDER_OPTIONS: FilterOption[] = [
  { code: 'all', name: '전체', apiCode: '' },
  { code: '0', name: '남성', apiCode: '0' },
  { code: '1', name: '여성', apiCode: '1' },
  { code: '2', name: '미상', apiCode: '2' }
];
