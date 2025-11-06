'use client';

import { Bell, Heart, MessageCircle, UserPlus, Award, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import styles from './notification.module.scss';

import { fetchGroo } from '@/apis';
import { useNotificationStore } from '@/stores/notification';
import { Alert, NotificationType } from '@/types/notification';

// ===============================
//  Notification Item
// ===============================
interface NotificationItemProps {
  alert: Alert;
  onRead: (alertId: number) => void;
}

function NotificationItem({ alert, onRead }: NotificationItemProps) {
  const router = useRouter();

  const getIcon = (type: NotificationType) => {
    const iconProps = { size: 20, className: styles.icon };
    switch (type) {
      case 'like':
        return <Heart {...iconProps} className={`${styles.icon} ${styles.like}`} />;
      case 'comment':
        return <MessageCircle {...iconProps} className={`${styles.icon} ${styles.comment}`} />;
      case 'follow':
        return <UserPlus {...iconProps} className={`${styles.icon} ${styles.follow}`} />;
      case 'badge':
        return <Award {...iconProps} className={`${styles.icon} ${styles.badge}`} />;
      default:
        return <Bell {...iconProps} />;
    }
  };

  // 날짜 포맷 안정 버전
  const formatTime = (sendAt: string | number | Date | null | undefined) => {
    if (!sendAt) return '';
    let date: Date | null = null;

    if (sendAt instanceof Date) {
      date = sendAt;
    } else if (typeof sendAt === 'number') {
      date = new Date(sendAt > 1e12 ? sendAt : sendAt * 1000);
    } else if (typeof sendAt === 'string') {
      let s = sendAt.trim().replace(' ', 'T');
      if (!/[zZ]|[+\-]\d{2}:\d{2}$/.test(s)) s += '+09:00';
      date = new Date(s);
    }

    if (!date || isNaN(date.getTime())) {
      return '';
    }

    const diffSec = Math.floor((Date.now() - date.getTime()) / 1000);

    if (diffSec < 60) return '방금 전';
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}분 전`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}시간 전`;
    if (diffSec < 604800) return `${Math.floor(diffSec / 86400)}일 전`;
    if (diffSec < 2592000) return `${Math.floor(diffSec / 604800)}주 전`;
    if (diffSec < 31536000) return `${Math.floor(diffSec / 2592000)}개월 전`;
    return `${Math.floor(diffSec / 31536000)}년 전`;
  };

  const handleClick = async () => {
    if (!alert.alertsCheckStatus) {
      await onRead(alert.alertId);
    }

    switch (alert.senderType) {
      case 'review':
        if (alert.type === 'comment' && alert.detailSenderId) {
          router.push(`/reviews/${alert.senderId}#comment-${alert.detailSenderId}`);
        } else {
          router.push(`/reviews/${alert.senderId}`);
        }
        break;
      case 'user':
        if (alert.type === 'follow') {
          router.push(`/users/${alert.senderUserId}`);
        }
        break;
      case 'users':
        if (alert.type === 'badge') {
          router.push(`/dashboard`);
        }
        break;
      default:
        break;
    }
  };

  return (
    <div
      className={`${styles.notification_item} ${!alert.alertsCheckStatus ? styles.unread : ''}`}
      onClick={handleClick}>
      <div className={styles.icon_wrapper}>{getIcon(alert.type)}</div>
      <div className={styles.content}>
        <p className={styles.message}>{alert.content}</p>
        {/* 시간 표시 복구 */}
        <span className={styles.time}>{formatTime(alert.sendAt || alert.sendAt)}</span>
      </div>
      {!alert.alertsCheckStatus && <div className={styles.unread_dot} />}
    </div>
  );
}

// ===============================
//  Notification Dropdown
// ===============================
interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

function NotificationDropdown({ isOpen, onClose }: NotificationDropdownProps) {
  const [isLoading, setIsLoading] = useState(false);

  const { alerts, unreadCount, setUnreadCount, resetUnread, setAlerts } = useNotificationStore();

  // 알림 목록 조회 + 최신순 정렬
  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const response = await fetchGroo.notification.getNotifications();
      const list = (response.data || []).sort(
        (a: Alert, b: Alert) =>
          new Date(b.sendAt || b.sendAt).getTime() - new Date(a.sendAt || a.sendAt).getTime()
      );
      setAlerts(list);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await fetchGroo.notification.getUnreadCount();
      setUnreadCount(response.data || 0);
    } catch (error) {}
  };

  const handleReadNotification = async (alertId: number) => {
    try {
      await fetchGroo.notification.updateNotificationStatus(alertId, {
        alertsCheckStatus: true
      });
      setAlerts(
        alerts.map((alert) => (alert.alertId === alertId ? { ...alert, alertsCheckStatus: true } : alert))
      );
      setUnreadCount(Math.max(0, unreadCount - 1));
    } catch (error) {}
  };

  const handleReadAll = async () => {
    try {
      const unreadIds = alerts.filter((a) => !a.alertsCheckStatus).map((a) => a.alertId);
      if (unreadIds.length === 0) return;

      await fetchGroo.notification.updateAllNotifications({
        alertIdList: unreadIds
      });

      setAlerts(alerts.map((a) => ({ ...a, alertsCheckStatus: true })));
      resetUnread();
    } catch (error) {}
  };

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
      fetchUnreadCount();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div className={styles.overlay} onClick={onClose} />
      <div className={styles.dropdown}>
        <div className={styles.header}>
          <div className={styles.title_wrapper}>
            <h3 className={styles.title}>알림</h3>
            {unreadCount > 0 && <span className={styles.unread_badge}>{unreadCount}</span>}
          </div>
          {unreadCount > 0 && (
            <button className={styles.read_all_btn} onClick={handleReadAll}>
              <Check size={16} />
              <span>전체 읽음</span>
            </button>
          )}
        </div>

        <div className={styles.content}>
          {isLoading ? (
            <div className={styles.loading}>알림을 불러오는 중...</div>
          ) : alerts.length === 0 ? (
            <div className={styles.empty}>새로운 알림이 없습니다</div>
          ) : (
            <div className={styles.list}>
              {/* 최신순으로 정렬된 결과 표시 */}
              {alerts.map((alert) => (
                <NotificationItem key={alert.alertId} alert={alert} onRead={handleReadNotification} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default NotificationDropdown;
