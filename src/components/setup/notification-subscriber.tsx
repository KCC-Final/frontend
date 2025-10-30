'use client';

import { useEffect } from 'react';

import { useNotificationStore } from '@/stores/notification';

export default function NotificationSubscriber() {
  const connectSSE = useNotificationStore((state) => state.connectSSE);

  useEffect(() => {
    connectSSE();
  }, [connectSSE]);

  return null; // UI 없음 (백그라운드 전용)
}
