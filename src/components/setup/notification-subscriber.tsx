'use client';

import { useEffect } from 'react';

import { useNotificationStore } from '@/stores/notification';
import { User } from '@/types';

interface NotificationSubscriberProps {
  user: User | null;
}

export default function NotificationSubscriber({ user }: NotificationSubscriberProps) {
  const connectSSE = useNotificationStore((state) => state.connectSSE);

  useEffect(() => {
    // 로그인한 사용자만 SSE 연결
    if (user) {
      connectSSE();
    }
  }, [user, connectSSE]);

  return null; // UI 없음 (백그라운드 전용)
}
