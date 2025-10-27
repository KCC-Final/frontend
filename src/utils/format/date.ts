import { format, formatDistanceToNow, differenceInDays, isSameYear } from 'date-fns';
import { ko } from 'date-fns/locale/ko';

/**
 * 주어진 날짜를 현재 시간과의 차이에 따라 상대적인 시간 또는 특정 형식으로 변환합니다.
 * - 1일 미만: ?분 전 / ?시간 전
 * - 7일 미만: ?일 전
 * - 같은 해: MM월 dd일
 * - 다른 해: yy년 MM월 dd일
 * @param dateInput - 날짜 문자열 또는 Date 객체
 * @returns 포맷된 날짜 문자열
 */
export function formatRelativeTime(dateInput: string | Date): string {
  try {
    const date = new Date(dateInput);
    const now = new Date();
    const diffDays = differenceInDays(now, date);

    if (diffDays < 1) {
      // 1일 미만 (오늘) -> ?분 전, ?시간 전
      return formatDistanceToNow(date, { addSuffix: true, locale: ko });
    } else if (diffDays < 7) {
      // 1일 이상 ~ 7일 미만 -> ?일 전
      return formatDistanceToNow(date, { addSuffix: true, locale: ko });
    } else if (isSameYear(now, date)) {
      // 7일 이상 & 같은 해 -> MM월 dd일
      return format(date, 'MM월 dd일', { locale: ko });
    } else {
      // 다른 해 -> yy년 MM월 dd일
      return format(date, 'yy년 MM월 dd일', { locale: ko });
    }
  } catch (error) {
    console.error('Error formatting date:', error);
    return '날짜 형식 오류'; // 오류 발생 시 대체 텍스트
  }
}
