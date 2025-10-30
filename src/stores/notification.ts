import { create } from 'zustand';

import { fetchGroo } from '@/apis';
import { Alert } from '@/types/notification';

interface NotificationState {
  alerts: Alert[];
  unreadCount: number;
  setAlerts: (alerts: Alert[]) => void;
  setUnreadCount: (count: number) => void;
  increaseUnread: () => void;
  resetUnread: () => void;
  connectSSE: () => void;
}

// 전역 단일 SSE 인스턴스
let eventSource: EventSource | null = null;

export const useNotificationStore = create<NotificationState>((set, get) => ({
  alerts: [],
  unreadCount: 0,

  setAlerts: (alerts) => set({ alerts }),
  setUnreadCount: (count) => set({ unreadCount: count }),
  increaseUnread: () => set((state) => ({ unreadCount: state.unreadCount + 1 })),
  resetUnread: () => set({ unreadCount: 0 }),

  // notification.ts (store)
  connectSSE: () => {
    if (eventSource) return;

    const connect = () => {
      eventSource = fetchGroo.notification.subscribe(
        (data: Alert) => {
          set((state) => ({
            alerts: [data, ...state.alerts],
            unreadCount: state.unreadCount + 1
          }));
        },
        (error) => {
          console.error('[SSE Error]', error);
          eventSource?.close();
          eventSource = null;
          // 3초 후 자동 재연결
          setTimeout(connect, 3000);
        }
      );
    };

    connect(); // 최초 연결 시도
  }
}));
