interface ChallengeError {
  response?: {
    data?: {
      message?: string;
      error?: string;
    };
    status?: number;
  };
  message?: string;
  code?: string;
}

const CHALLENGE_ERROR_MESSAGES: Record<string, string> = {
  // 400 Bad Request
  'CHG-001': '잘못된 뱃지 요청입니다.',
  'CHG-002': '뱃지 ID가 유효하지 않습니다.',
  'CHG-003': '사용자 ID가 유효하지 않습니다.',

  // 401 Unauthorized
  'CHG-100': '로그인이 필요합니다.',

  // 403 Forbidden
  'CHG-200': '해당 뱃지에 접근할 권한이 없습니다.',
  'CHG-201': '다른 사용자의 뱃지 정보를 볼 수 없습니다.',

  // 404 Not Found
  'CHG-300': '뱃지를 찾을 수 없습니다.',
  'CHG-301': '사용자를 찾을 수 없습니다.',
  'CHG-302': '획득 기록을 찾을 수 없습니다.',

  // 409 Conflict
  'CHG-400': '이미 획득한 뱃지입니다.',
  'CHG-401': '뱃지 조건을 충족하지 못했습니다.',

  // 422 Unprocessable Entity
  'CHG-500': '뱃지 달성 조건을 확인할 수 없습니다.',
  'CHG-501': '뱃지 진행도를 계산할 수 없습니다.',

  // 500 Internal Server Error
  'CHG-900': '뱃지 시스템 오류가 발생했습니다.',
  'CHG-901': '뱃지 데이터베이스 오류가 발생했습니다.',
  'CHG-999': '알 수 없는 오류가 발생했습니다.'
};

export const getChallengeErrorMessage = (error: ChallengeError): string => {
  // 에러 응답에서 메시지 추출
  const errorMessage = error?.response?.data?.message || error?.response?.data?.error;

  if (errorMessage) {
    // 에러 코드 패턴 확인 (CHG-XXX)
    const errorCodeMatch = errorMessage.match(/CHG-\d{3}/);
    if (errorCodeMatch) {
      const errorCode = errorCodeMatch[0];
      return CHALLENGE_ERROR_MESSAGES[errorCode] || errorMessage;
    }
    return errorMessage;
  }

  // HTTP 상태 코드별 기본 메시지
  const status = error?.response?.status;
  switch (status) {
    case 400:
      return '잘못된 요청입니다.';
    case 401:
      return '로그인이 필요합니다.';
    case 403:
      return '권한이 없습니다.';
    case 404:
      return '뱃지 정보를 찾을 수 없습니다.';
    case 409:
      return '이미 처리된 요청입니다.';
    case 500:
      return '서버 오류가 발생했습니다.';
    default:
      return error?.message || '뱃지 조회 중 오류가 발생했습니다.';
  }
};

export const isAuthError = (error: ChallengeError): boolean => {
  const status = error?.response?.status;
  return status === 401 || status === 403;
};

export const isNotFoundError = (error: ChallengeError): boolean => {
  const status = error?.response?.status;
  return status === 404;
};

export const isConflictError = (error: ChallengeError): boolean => {
  const status = error?.response?.status;
  return status === 409;
};
