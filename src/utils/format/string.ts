/**
 * 저자 문자열에서 ' (지은이)' 부분을 기준으로 주 저자만 추출합니다.
 * @param authorString - 저자 정보 문자열 (e.g., "홍길동 (지은이), 최윤성 (옮긴이)")
 * @returns 추출된 주 저자 이름. " (지은이)"가 없으면 첫 번째 저자 또는 전체 문자열을 반환합니다.
 */
export const formatBookAuthor = (authorString: string): string => {
  // 빈 문자열 처리
  if (!authorString) {
    return '';
  }

  // 주 저자 추출
  const authors = authorString.split(',').map((s) => s.trim());
  const primaryAuthorEntry = authors.find((author) => author.includes('(지은이)'));

  // ' (지은이)'가 포함되어있는 경우 해당 저자 이름만 반환
  if (primaryAuthorEntry) {
    return primaryAuthorEntry.split('(지은이)')[0].trim();
  }

  // ' (지은이)'가 없는 경우, 첫 번째 저자 이름을 반환하거나 전체를 반환
  return authors[0].split('(')[0].trim();
};

/**
 * 도서 제목에서 부제나 버전 정보를 나타내는 " - " 이후의 문자열을 제거합니다.
 * @param title - 도서 제목 문자열 (e.g., "모순 - 개정판")
 * @returns 포맷팅된 도서 제목
 */
export const formatBookTitle = (title: string): string => {
  if (!title) {
    return '';
  }
  return title.split(' - ')[0].trim();
};
