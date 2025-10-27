'use client';

import { Bell } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';

import styles from './bell.module.scss';

import { fetchGroo } from '@/apis';
import NotificationDropdown from '@/components/notification/dropdown';

function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // 읽지 않은 알림 개수 조회
  const fetchUnreadCount = async () => {
    try {
      const response = await fetchGroo.notification.getUnreadCount();
      setUnreadCount(response.data || 0);
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  };

  // 드롭다운 토글
  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  // 드롭다운 닫기
  const closeDropdown = () => {
    setIsOpen(false);
  };

  // SSE 구독하여 실시간 알림 개수 업데이트
  useEffect(() => {
    const eventSource = fetchGroo.notification.subscribe(
      () => {
        setUnreadCount((prev) => prev + 1);
      },
      (error) => {
        console.error('SSE connection error:', error);
      }
    );

    return () => {
      eventSource.close();
    };
  }, []);

  // 컴포넌트 마운트 시 읽지 않은 알림 개수 조회
  useEffect(() => {
    fetchUnreadCount();
  }, []);

  return (
    <div className={styles.notification_bell_wrapper}>
      <button ref={buttonRef} className={styles.bell_button} onClick={toggleDropdown} aria-label="알림">
        <Bell size={26} color="#333333" />
        {unreadCount > 0 && <span className={styles.badge}>{unreadCount > 99 ? '99+' : unreadCount}</span>}
      </button>

      <NotificationDropdown isOpen={isOpen} onClose={closeDropdown} />
    </div>
  );
}

export default NotificationBell;
