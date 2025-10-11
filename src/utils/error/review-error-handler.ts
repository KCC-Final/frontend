export const getReviewErrorMessage = (error: any): string => {
  const errorMessage = error?.message || '';

  // RVW-402: 본인 독후감 좋아요
  if (errorMessage.includes('RVW-402')) {
    return '본인의 독후감에는 좋아요를 누를 수 없습니다.';
  }

  // RVW-400: 중복 좋아요
  if (errorMessage.includes('RVW-400')) {
    return '이미 좋아요를 누른 독후감입니다.';
  }

  // RVW-401: 좋아요 취소 불가
  if (errorMessage.includes('RVW-401')) {
    return '좋아요를 누르지 않은 독후감입니다.';
  }

  // RVW-503: 임시저장 글 좋아요 불가
  if (errorMessage.includes('RVW-503')) {
    return '임시저장 글에는 좋아요를 할 수 없습니다.';
  }

  // RVW-504: 삭제된 독후감 좋아요 불가
  if (errorMessage.includes('RVW-504')) {
    return '삭제된 독후감에는 좋아요를 할 수 없습니다.';
  }

  // RVW-508: 비밀글 좋아요 불가
  if (errorMessage.includes('RVW-508')) {
    return '비밀글에는 좋아요를 할 수 없습니다.';
  }

  // RVW-203: 작성자 아님 (독후감)
  if (errorMessage.includes('RVW-203')) {
    return '독후감 작성자만 수정/삭제할 수 있습니다.';
  }

  // RVW-204: 작성자 아님 (댓글)
  if (errorMessage.includes('RVW-204')) {
    return '댓글 작성자만 수정/삭제할 수 있습니다.';
  }

  // RVW-300: 독후감 없음
  if (errorMessage.includes('RVW-300')) {
    return '독후감을 찾을 수 없습니다.';
  }

  // RVW-301: 댓글 없음
  if (errorMessage.includes('RVW-301')) {
    return '댓글을 찾을 수 없습니다.';
  }

  // RVW-005: 댓글 내용 없음
  if (errorMessage.includes('RVW-005')) {
    return '댓글 내용을 입력해주세요.';
  }

  // RVW-505: 임시저장 글 댓글 불가
  if (errorMessage.includes('RVW-505')) {
    return '임시저장 글에는 댓글을 작성할 수 없습니다.';
  }

  // RVW-506: 삭제된 독후감 댓글 불가
  if (errorMessage.includes('RVW-506')) {
    return '삭제된 독후감에는 댓글을 작성할 수 없습니다.';
  }

  // RVW-507: 비밀글 댓글 불가
  if (errorMessage.includes('RVW-507')) {
    return '비밀글에는 댓글을 작성할 수 없습니다.';
  }

  // RVW-006: 부모 댓글 없음
  if (errorMessage.includes('RVW-006')) {
    return '존재하지 않는 부모 댓글입니다.';
  }

  // RVW-200: 독후감 접근 권한 없음
  if (errorMessage.includes('RVW-200')) {
    return '해당 독후감에 접근할 권한이 없습니다.';
  }

  // RVW-201: 댓글 접근 권한 없음
  if (errorMessage.includes('RVW-201')) {
    return '해당 댓글에 접근할 권한이 없습니다.';
  }

  // RVW-500: 삭제된 독후감
  if (errorMessage.includes('RVW-500')) {
    return '삭제된 독후감입니다.';
  }

  // RVW-501: 임시저장 글 접근 불가
  if (errorMessage.includes('RVW-501')) {
    return '임시저장 글은 작성자만 볼 수 있습니다.';
  }

  // RVW-502: 비밀글 접근 불가
  if (errorMessage.includes('RVW-502')) {
    return '비밀글은 작성자만 볼 수 있습니다.';
  }

  // RVW-100: 로그인 필요
  if (errorMessage.includes('RVW-100')) {
    return '로그인이 필요합니다.';
  }

  // 기본 에러 메시지
  return '요청 처리 중 오류가 발생했습니다.';
};
