// Badge 엔티티
export interface Badge {
  badgeId: number;
  badgeName: string;
  badgeDescription: string;
  badgeConditions: number;
}

// 사용자가 획득한 뱃지 응답
export interface UserBadgeResponse {
  badgeId: number;
  badgeName: string;
  badgeDescription: string;
  badgeConditions: number;
  acquiredDate: string;
}

// 사용자의 뱃지 획득 상태를 포함한 응답
export interface UserBadgeStatusResponse {
  badgeId: number;
  badgeName: string;
  badgeDescription: string;
  badgeConditions: number;
  currentProgress: number;
  acquired: boolean;
  acquiredDate: string | null;
}

// API 응답 타입
export interface BadgeListResponse {
  message: string;
  data: UserBadgeResponse[];
}

export interface BadgeStatusListResponse {
  message: string;
  data: UserBadgeStatusResponse[];
}

// 뱃지 카테고리 (프론트에서 분류용)
export enum BadgeCategory {
  FIRST_ACTIVITY = '첫 활동',
  REVIEW_COUNT = '독후감 작성',
  SINGLE_CATEGORY = '한 분야 전문가',
  MULTI_CATEGORY = '다양한 탐험가',
  SPECIAL = '특별 뱃지'
}

// 뱃지 이름별 카테고리 매핑
export const BADGE_CATEGORY_MAP: Record<string, BadgeCategory> = {
  '첫 발자국': BadgeCategory.FIRST_ACTIVITY,
  '첫 공감': BadgeCategory.FIRST_ACTIVITY,
  '모임의 시작': BadgeCategory.FIRST_ACTIVITY,
  '첫 소통': BadgeCategory.FIRST_ACTIVITY,
  '첫 인연': BadgeCategory.FIRST_ACTIVITY,
  '첫 발견': BadgeCategory.FIRST_ACTIVITY,
  첫인사: BadgeCategory.FIRST_ACTIVITY,
  개척자: BadgeCategory.FIRST_ACTIVITY,

  독서가: BadgeCategory.REVIEW_COUNT,
  애독가: BadgeCategory.REVIEW_COUNT,
  '열혈 독서가': BadgeCategory.REVIEW_COUNT,
  '책의 지배자': BadgeCategory.REVIEW_COUNT,

  '한 우물 파기 I': BadgeCategory.SINGLE_CATEGORY,
  '한 우물 파기 II': BadgeCategory.SINGLE_CATEGORY,
  '한 우물 파기 III': BadgeCategory.SINGLE_CATEGORY,
  '한 우물 파기 IV': BadgeCategory.SINGLE_CATEGORY,

  '작은 탐험가': BadgeCategory.MULTI_CATEGORY,
  '넓은 탐험가': BadgeCategory.MULTI_CATEGORY,
  '위대한 탐험가': BadgeCategory.MULTI_CATEGORY,

  '이달의 독서왕': BadgeCategory.SPECIAL
};

// 뱃지 아이콘 매핑 (이모지 또는 아이콘 컴포넌트용)
export const BADGE_ICONS: Record<string, string> = {
  '첫 발자국': '👣',
  '첫 공감': '❤️',
  '모임의 시작': '👥',
  '첫 소통': '💬',
  '첫 인연': '🤝',
  '첫 발견': '🔍',
  첫인사: '👋',
  개척자: '🚀',

  독서가: '📚',
  애독가: '📖',
  '열혈 독서가': '🔥',
  '책의 지배자': '👑',

  '한 우물 파기 I': '🎯',
  '한 우물 파기 II': '🎯',
  '한 우물 파기 III': '🎯',
  '한 우물 파기 IV': '🎯',

  '작은 탐험가': '🗺️',
  '넓은 탐험가': '🧭',
  '위대한 탐험가': '🌍',

  '이달의 독서왕': '🏆'
};
