export const getSearchErrorMessage = (error: any): string => {
  const errorCode = error?.response?.data?.errorCode || error?.errorCode || '';
  const backendMessage = error?.response?.data?.message || error?.message || '';

  switch (errorCode) {
    case 'SCH-001':
      return '검색어를 입력해주세요';
    case 'SCH-100':
      return '로그인이 필요합니다';
    case 'SCH-500':
      return '검색 중 오류가 발생했습니다';
    default:
      return backendMessage || '검색 중 오류가 발생했습니다';
  }
};
