import axiosGroo from '@/apis/groo/config';
import {
  GetNotificationsResDTO,
  UnreadCountResDTO,
  UpdateNotificationReqBody,
  UpdateNotificationResDTO,
  UpdateAllNotificationsReqBody,
  UpdateAllNotificationsResDTO,
  SendNotificationReqBody,
  SendNotificationResDTO,
  DeleteNotificationResDTO
} from '@/types/notification';

export const notification = {
  // SSE 구독 (EventSource 사용)
  subscribe: (onMessage: (data: any) => void, onError?: (error: any) => void) => {
    const baseURL = `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_GROO_COMMON_PATH}`;
    const eventSource = new EventSource(`${baseURL}/alarms/subscribe`, {
      withCredentials: true
    });

    eventSource.addEventListener('alert', (event) => {
      try {
        const raw = JSON.parse(event.data);
        const normalized = {
          alertId: raw.alertId,
          type: raw.type,
          content: raw.content,
          sendAt: raw.sendAt ?? raw.sentAt ?? null,
          senderType: raw.senderType,
          senderId: raw.senderId,
          detailSenderId: raw.detailSenderId,
          userId: raw.userId,
          senderUserId: raw.senderUserId,
          alertsCheckStatus: raw.alertsCheckStatus
        };
        onMessage(normalized);
      } catch {
        /* ignore malformed event */
      }
    });

    eventSource.onerror = (error) => {
      if (onError) onError(error);
      eventSource.close();
    };

    return eventSource;
  },

  // 알림 목록 조회
  getNotifications: async (): Promise<GetNotificationsResDTO> => {
    const response = await axiosGroo.get('/alarms');
    return response.data;
  },

  // 읽지 않은 알림 개수 조회
  getUnreadCount: async (): Promise<UnreadCountResDTO> => {
    const response = await axiosGroo.get('/alarms/unread-count');
    return response.data;
  },

  // 알림 읽음 처리 (단건)
  updateNotificationStatus: async (
    alertId: number,
    data: UpdateNotificationReqBody
  ): Promise<UpdateNotificationResDTO> => {
    const response = await axiosGroo.put(`/alarms/${alertId}/check`, data);
    return response.data;
  },

  // 알림 전체 읽음 처리
  updateAllNotifications: async (
    data: UpdateAllNotificationsReqBody
  ): Promise<UpdateAllNotificationsResDTO> => {
    const response = await axiosGroo.put('/alarms/check-list', data);
    return response.data;
  },

  // 알림 전송 (테스트용)
  sendNotification: async (data: SendNotificationReqBody): Promise<SendNotificationResDTO> => {
    const response = await axiosGroo.post('/alarms/send', data);
    return response.data;
  },

  // 알림 삭제 (소프트 삭제)
  deleteNotification: async (alertId: number): Promise<DeleteNotificationResDTO> => {
    const response = await axiosGroo.delete(`/alarms/${alertId}`);
    return response.data;
  }
};
