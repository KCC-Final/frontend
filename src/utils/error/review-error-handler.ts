/**
 * Review 도메인 에러 메시지 매핑
 * @author uyh
 * @created 2025-10-11
 * @modified 2025-10-12 - 백엔드 ReviewErrorCode.java와 100% 일치하도록 수정
 */

export const getReviewErrorMessage = (error: any): string => {
  // 에러 코드 추출 (여러 위치에서 시도)
  const errorCode =
    error?.response?.data?.errorCode || // axios 응답
    error?.errorCode || // 직접 전달된 경우
    '';

  // 에러 메시지 추출
  const backendMessage = error?.response?.data?.message || error?.message || '';

  console.log('=== Error Debug ===');
  console.log('errorCode:', errorCode);
  console.log('backendMessage:', backendMessage);

  // 에러 코드로 매칭 (백엔드 ReviewErrorCode.java와 동일한 순서 및 메시지)
  switch (errorCode) {
    // === 001~099: 입력값 검증 오류 (400 Bad Request) ===
    case 'RVW-001':
      return '잘못된 독후감 요청입니다';
    case 'RVW-002':
      return '독후감 내용을 입력해주세요';
    case 'RVW-003':
      return '독후감 제목을 입력해주세요';
    case 'RVW-004':
      return '올바른 ISBN 형식이 아닙니다';
    case 'RVW-005':
      return '댓글 내용을 입력해주세요';
    case 'RVW-006':
      return '존재하지 않는 부모 댓글입니다';

    // === 100~199: 인증 오류 (401 Unauthorized) ===
    case 'RVW-100':
      return '로그인이 필요합니다';

    // === 200~299: 권한 오류 (403 Forbidden) ===
    case 'RVW-200':
      return '해당 독후감에 접근할 권한이 없습니다';
    case 'RVW-201':
      return '해당 댓글에 접근할 권한이 없습니다';
    case 'RVW-202':
      return '해당 임시저장 글에 접근할 권한이 없습니다';
    case 'RVW-203':
      return '독후감 작성자만 수정/삭제할 수 있습니다';
    case 'RVW-204':
      return '댓글 작성자만 수정/삭제할 수 있습니다';
    case 'RVW-205':
      return '임시저장 글 작성자만 접근할 수 있습니다';

    // === 300~399: 리소스 없음 (404 Not Found) ===
    case 'RVW-300':
      return '독후감을 찾을 수 없습니다';
    case 'RVW-301':
      return '댓글을 찾을 수 없습니다';
    case 'RVW-302':
      return '임시저장 글을 찾을 수 없습니다';
    case 'RVW-303':
      return '사용자를 찾을 수 없습니다';

    // === 400~499: 충돌 (409 Conflict) ===
    case 'RVW-400':
      return '이미 좋아요를 누른 독후감입니다';
    case 'RVW-401':
      return '좋아요를 누르지 않은 독후감입니다';
    case 'RVW-402':
      return '본인이 작성한 독후감에는 좋아요를 할 수 없습니다';

    // === 500~599: 비즈니스 규칙 위반 (422 Unprocessable Entity) ===
    case 'RVW-500':
      return '삭제된 독후감입니다';
    case 'RVW-501':
      return '임시저장 글은 작성자만 볼 수 있습니다';
    case 'RVW-502':
      return '비밀글은 작성자만 볼 수 있습니다';
    case 'RVW-503':
      return '임시저장 글에는 좋아요를 할 수 없습니다';
    case 'RVW-504':
      return '삭제된 독후감에는 좋아요를 할 수 없습니다';
    case 'RVW-505':
      return '임시저장 글에는 댓글을 작성할 수 없습니다';
    case 'RVW-506':
      return '삭제된 독후감에는 댓글을 작성할 수 없습니다';
    case 'RVW-507':
      return '비밀글에는 댓글을 작성할 수 없습니다';
    case 'RVW-508':
      return '비밀글에는 좋아요를 할 수 없습니다';

    // === 600~699: 컨텐츠 길이 검증 오류 (400 Bad Request) ===
    case 'RVW-600':
      return '독후감 제목은 최소 2자 이상이어야 합니다';
    case 'RVW-601':
      return '독후감 내용은 최소 10자 이상이어야 합니다';
    case 'RVW-602':
      return '독후감 제목은 200자를 초과할 수 없습니다';
    case 'RVW-603':
      return '독후감 내용은 10,000자를 초과할 수 없습니다';
    case 'RVW-604':
      return '댓글은 500자를 초과할 수 없습니다';
    case 'RVW-605':
      return '댓글은 최소 1자 이상이어야 합니다';

    // === 900~999: 서버 오류 (500 Internal Server Error) ===
    case 'RVW-900':
      return '데이터베이스 오류가 발생했습니다';
    case 'RVW-901':
      return '독후감 작성에 실패했습니다';
    case 'RVW-902':
      return '독후감 수정에 실패했습니다';
    case 'RVW-903':
      return '독후감 삭제에 실패했습니다';
    case 'RVW-904':
      return '댓글 작성에 실패했습니다';
    case 'RVW-905':
      return '댓글 수정에 실패했습니다';
    case 'RVW-906':
      return '댓글 삭제에 실패했습니다';
  }

  // 에러 메시지에 코드가 포함되어 있는 경우 (fallback)
  if (backendMessage && backendMessage.includes('RVW-')) {
    // 메시지에서 에러 코드 추출
    const match = backendMessage.match(/RVW-\d{3}/);
    if (match) {
      const code = match[0];

      // 재귀 호출로 매핑된 메시지 반환
      const mappedError = { errorCode: code };
      return getReviewErrorMessage(mappedError);
    }
  }

  // 백엔드에서 한글 메시지를 직접 보낸 경우 그대로 사용
  if (
    backendMessage &&
    !backendMessage.includes('Request failed') &&
    !backendMessage.includes('Network Error')
  ) {
    return backendMessage;
  }

  // HTTP 상태 코드별 기본 메시지
  const status = error?.response?.status;
  switch (status) {
    case 400:
      return '잘못된 요청입니다';
    case 401:
      return '로그인이 필요합니다';
    case 403:
      return '접근 권한이 없습니다';
    case 404:
      return '요청한 정보를 찾을 수 없습니다';
    case 409:
      return '이미 처리된 요청입니다';
    case 422:
      return '처리할 수 없는 요청입니다';
    case 500:
      return '서버 오류가 발생했습니다';
    default:
      return '요청 처리 중 오류가 발생했습니다';
  }
};
