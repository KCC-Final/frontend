/**
 * Dashboard 에러 코드 매핑
 * 백엔드 DashboardErrorCode.java와 동기화
 */
const DASHBOARD_ERROR_MESSAGES: Record<string, string> = {
  // 001~099: 입력값 검증 오류 (400)
  'DSH-001': '잘못된 연도입니다',
  'DSH-002': '잘못된 월입니다. 1-12 사이의 값을 입력해주세요',
  'DSH-003': '사용자 ID가 유효하지 않습니다',
  'DSH-004': '연도는 1900년부터 2100년 사이여야 합니다',

  // 100~199: 인증 오류 (401)
  'DSH-100': '로그인이 필요합니다',
  'DSH-101': '유효하지 않은 토큰입니다',

  // 200~299: 권한 오류 (403)
  'DSH-200': '대시보드에 접근할 권한이 없습니다',

  // 300~399: 리소스 없음 (404)
  'DSH-300': '사용자를 찾을 수 없습니다',
  'DSH-301': '조회된 데이터가 없습니다',

  // 900~999: 서버 오류 (500)
  'DSH-900': '데이터베이스 오류가 발생했습니다',
  'DSH-901': '대시보드 통계 조회에 실패했습니다',
  'DSH-902': '월별 통계 조회에 실패했습니다',
  'DSH-903': '월간 리포트 조회에 실패했습니다'
};

/**
 * HTTP 상태 코드별 기본 메시지
 */
const DEFAULT_ERROR_MESSAGES: Record<number, string> = {
  400: '잘못된 요청입니다',
  401: '로그인이 필요합니다',
  403: '접근 권한이 없습니다',
  404: '요청한 리소스를 찾을 수 없습니다',
  409: '충돌이 발생했습니다',
  422: '처리할 수 없는 요청입니다',
  500: '서버 오류가 발생했습니다',
  502: '게이트웨이 오류가 발생했습니다',
  503: '서비스를 일시적으로 사용할 수 없습니다'
};

/**
 * Dashboard 에러 응답 타입
 */
interface DashboardErrorResponse {
  errorCode?: string;
  message?: string;
  status?: number;
}

/**
 * Dashboard 에러 메시지 추출 함수
 * @param error - 에러 객체
 * @returns 사용자 친화적인 에러 메시지
 */
export function getDashboardErrorMessage(error: any): string {
  // 네트워크 에러
  if (!error.response) {
    if (error.message === 'Network Error') {
      return '네트워크 연결을 확인해주세요';
    }
    return error.message || '알 수 없는 오류가 발생했습니다';
  }

  const response = error.response;
  const data: DashboardErrorResponse = response.data || {};

  // 1. 백엔드에서 보낸 에러 코드가 있는 경우
  if (data.errorCode && DASHBOARD_ERROR_MESSAGES[data.errorCode]) {
    return DASHBOARD_ERROR_MESSAGES[data.errorCode];
  }

  // 2. 백엔드에서 보낸 메시지가 있는 경우
  if (data.message) {
    return data.message;
  }

  // 3. HTTP 상태 코드로 기본 메시지 반환
  const statusCode = response.status;
  if (DEFAULT_ERROR_MESSAGES[statusCode]) {
    return DEFAULT_ERROR_MESSAGES[statusCode];
  }

  // 4. 기본 에러 메시지
  return '요청 처리 중 오류가 발생했습니다';
}

/**
 * 에러 코드 체크 함수
 * @param error - 에러 객체
 * @param errorCode - 체크할 에러 코드
 * @returns 에러 코드 일치 여부
 */
export function isDashboardError(error: any, errorCode: string): boolean {
  if (!error.response || !error.response.data) {
    return false;
  }
  return error.response.data.errorCode === errorCode;
}

/**
 * 인증 에러 체크
 * @param error - 에러 객체
 * @returns 인증 에러 여부
 */
export function isAuthError(error: any): boolean {
  return (
    isDashboardError(error, 'DSH-100') ||
    isDashboardError(error, 'DSH-101') ||
    (error.response && error.response.status === 401)
  );
}

/**
 * 권한 에러 체크
 * @param error - 에러 객체
 * @returns 권한 에러 여부
 */
export function isForbiddenError(error: any): boolean {
  return isDashboardError(error, 'DSH-200') || (error.response && error.response.status === 403);
}

/**
 * 입력값 검증 에러 체크
 * @param error - 에러 객체
 * @returns 입력값 검증 에러 여부
 */
export function isValidationError(error: any): boolean {
  if (!error.response || !error.response.data) {
    return false;
  }
  const errorCode = error.response.data.errorCode;
  return errorCode && errorCode.startsWith('DSH-0');
}
