'use client';

import { Bell } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import styles from './bell.module.scss';

import { fetchGroo } from '@/apis';
import NotificationDropdown from '@/components/notification/dropdown';
import { useNotificationStore } from '@/stores/notification';

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const { unreadCount, setUnreadCount } = useNotificationStore();

  // 서버에서 초기 알림 개수 조회
  useEffect(() => {
    (async () => {
      try {
        const res = await fetchGroo.notification.getUnreadCount();
        setUnreadCount(res.data || 0);
      } catch (e) {}
    })();
  }, [setUnreadCount]);

  return (
    <div className={styles.notification_bell_wrapper}>
      <button
        ref={buttonRef}
        className={styles.bell_button}
        onClick={() => setIsOpen((v) => !v)}
        aria-label="알림">
        <Bell size={26} color="#333333" />
        {unreadCount > 0 && <span className={styles.badge}>{unreadCount > 99 ? '99+' : unreadCount}</span>}
      </button>

      <NotificationDropdown isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
}
