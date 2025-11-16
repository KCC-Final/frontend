import { CommonResDTO } from '@/types';

// 알림 타입
export type NotificationType = 'follow' | 'like' | 'comment' | 'badge';

// 발신자 타입
export type SenderType = 'review' | 'follow' | 'likes' | 'users' | 'user';

// 알림 데이터
export interface Alert {
  alertId: number;
  type: NotificationType;
  content: string;
  sendAt: string;
  senderType: SenderType;
  senderId: number;
  detailSenderId: number;
  userId: string;
  senderUserId: string;
  alertsCheckStatus: boolean;
  isDeleted?: boolean;
}

// 알림 목록 조회 응답
export type GetNotificationsResDTO = CommonResDTO<Alert[]>;

// 읽지 않은 알림 개수 응답
export type UnreadCountResDTO = CommonResDTO<number>;

// 알림 읽음 처리 요청
export type UpdateNotificationReqBody = {
  alertsCheckStatus: boolean;
};

// 알림 읽음 처리 응답
export type UpdateNotificationResDTO = CommonResDTO<Alert>;

// 알림 전체 읽음 처리 요청
export type UpdateAllNotificationsReqBody = {
  alertIdList?: number[];
};

// 알림 전체 읽음 처리 응답
export type UpdateAllNotificationsResDTO = CommonResDTO<number>;

// 알림 전송 요청
export type SendNotificationReqBody = {
  type: NotificationType;
  senderType: SenderType;
  senderId: number;
  content: string;
  detailSenderId: number;
  userId: string;
  senderUserId: string;
};

// 알림 전송 응답
export type SendNotificationResDTO = CommonResDTO<null>;

// 알림 삭제 응답
export type DeleteNotificationResDTO = CommonResDTO<null>;
