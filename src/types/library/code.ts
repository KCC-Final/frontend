export type Region = { code: string; name: string };
export type DtlRegion = { code: string; regionName: string; dtlRegionName: string };

export type FilterCategory = 'region' | 'age' | 'gender';

export type RegionFilter = {
  code: string;
  name: string;
  apiCode: string | null;
};

/**
 * 연령 필터 옵션 (정보나루 API 공식 코드)
 */
export type AgeFilter = {
  code: string;
  name: string;
  apiCode: string | null;
};

/**
 * 성별 필터 옵션 (정보나루 API 공식 코드)
 */
export type GenderFilter = {
  code: string;
  name: string;
  apiCode: string | null;
};

/**
 * 지역별 필터 목록 (정보나루 공식 region 코드)
 * 전체 선택 시 region 파라미터를 생략해야 하므로 apiCode=null
 */
export const REGION_FILTERS: RegionFilter[] = [
  { code: 'all', name: '전국', apiCode: null },
  { code: '11', name: '서울', apiCode: '11' },
  { code: '21', name: '부산', apiCode: '21' },
  { code: '22', name: '대구', apiCode: '22' },
  { code: '23', name: '인천', apiCode: '23' },
  { code: '24', name: '광주', apiCode: '24' },
  { code: '25', name: '대전', apiCode: '25' },
  { code: '26', name: '울산', apiCode: '26' },
  { code: '29', name: '세종', apiCode: '29' },
  { code: '31', name: '경기', apiCode: '31' },
  { code: '32', name: '강원', apiCode: '32' },
  { code: '33', name: '충북', apiCode: '33' },
  { code: '34', name: '충남', apiCode: '34' },
  { code: '35', name: '전북', apiCode: '35' },
  { code: '36', name: '전남', apiCode: '36' },
  { code: '37', name: '경북', apiCode: '37' },
  { code: '38', name: '경남', apiCode: '38' },
  { code: '39', name: '제주', apiCode: '39' }
];

/**
 * 연령별 필터 목록 (정보나루 공식 age 코드)
 * 전체 선택 시 age 파라미터를 생략해야 하므로 apiCode=null
 */
export const AGE_FILTERS: AgeFilter[] = [
  { code: 'all', name: '전체', apiCode: null },
  { code: '0', name: '영유아(0~5세)', apiCode: '0' },
  { code: '6', name: '유아(6~7세)', apiCode: '6' },
  { code: '8', name: '초등(8~13세)', apiCode: '8' },
  { code: '14', name: '청소년(14~19세)', apiCode: '14' },
  { code: '20', name: '20대', apiCode: '20' },
  { code: '30', name: '30대', apiCode: '30' },
  { code: '40', name: '40대', apiCode: '40' },
  { code: '50', name: '50대', apiCode: '50' },
  { code: '60', name: '60세 이상', apiCode: '60' }
];

/**
 * 성별 필터 목록 (정보나루 공식 gender 코드)
 * 전체 선택 시 gender 파라미터를 생략해야 하므로 apiCode=null
 */
export const GENDER_FILTERS: GenderFilter[] = [
  { code: 'all', name: '전체', apiCode: null },
  { code: '0', name: '남성', apiCode: '0' },
  { code: '1', name: '여성', apiCode: '1' },
  { code: '2', name: '미상', apiCode: '2' }
];
// code.ts
// 매뉴얼 기준 코드 값 (UI에서 필요할 경우 import해서 사용)

export const GENDER_CODES = {
  male: '0',
  female: '1',
  unknown: '2'
} as const;

export const AGE_CODES = [
  '0', // 영유아(0~5)
  '6', // 유아(6~7)
  '8', // 초등(8~13)
  '14', // 청소년(14~19)
  '20', // 20대
  '30', // 30대
  '40', // 40대
  '50', // 50대
  '60', // 60세 이상
  '-1' // 미상
] as const;

export type GenderApiCode = (typeof GENDER_CODES)[keyof typeof GENDER_CODES];
export type AgeApiCode = (typeof AGE_CODES)[number];
