'use client';

import { Bell, Heart, MessageCircle, UserPlus, Award, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import styles from './notification.module.scss';

import { fetchGroo } from '@/apis';
import { Alert, NotificationType } from '@/types/notification';

interface NotificationItemProps {
  alert: Alert;
  onRead: (alertId: number) => void;
}

function NotificationItem({ alert, onRead }: NotificationItemProps) {
  const router = useRouter();

  // 타입별 아이콘 반환
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

  // 시간 포맷팅
  const formatTime = (sendAt: string) => {
    const now = new Date();
    const sent = new Date(sendAt);
    const diff = Math.floor((now.getTime() - sent.getTime()) / 1000);

    if (diff < 60) return '방금 전';
    if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}일 전`;
    if (diff < 2592000) return `${Math.floor(diff / 604800)}주 전`;
    if (diff < 31536000) return `${Math.floor(diff / 2592000)}개월 전`;
    return `${Math.floor(diff / 31536000)}년 전`;
  };

  // 알림 클릭 핸들러
  const handleClick = async () => {
    // 읽지 않은 알림이면 읽음 처리
    if (!alert.alertsCheckStatus) {
      await onRead(alert.alertId);
    }

    // 타입별 페이지 이동
    switch (alert.senderType) {
      case 'review':
        if (alert.type === 'comment' && alert.detailSenderId) {
          router.push(`/reviews/${alert.senderId}#comment-${alert.detailSenderId}`);
        } else {
          router.push(`/reviews/${alert.senderId}`);
        }
        break;

      case 'user': // senderType이 'user'일 때
        if (alert.type === 'follow') {
          // type이 'follow'면
          console.log('qwer', alert.senderUserId);
          router.push(`/users/${alert.senderUserId}`); // 팔로우한 사람 피드로
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
        <span className={styles.time}>{formatTime(alert.sendAt)}</span>
      </div>
      {!alert.alertsCheckStatus && <div className={styles.unread_dot} />}
    </div>
  );
}

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

function NotificationDropdown({ isOpen, onClose }: NotificationDropdownProps) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // 알림 목록 조회
  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const response = await fetchGroo.notification.getNotifications();
      setAlerts(response.data || []);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 읽지 않은 알림 개수 조회
  const fetchUnreadCount = async () => {
    try {
      const response = await fetchGroo.notification.getUnreadCount();
      setUnreadCount(response.data || 0);
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  };

  // 알림 읽음 처리
  const handleReadNotification = async (alertId: number) => {
    try {
      await fetchGroo.notification.updateNotificationStatus(alertId, {
        alertsCheckStatus: true
      });
      setAlerts((prev) =>
        prev.map((alert) => (alert.alertId === alertId ? { ...alert, alertsCheckStatus: true } : alert))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to update notification status:', error);
    }
  };

  // 전체 읽음 처리
  const handleReadAll = async () => {
    try {
      const unreadAlertIds = alerts.filter((alert) => !alert.alertsCheckStatus).map((alert) => alert.alertId);

      if (unreadAlertIds.length === 0) return;

      await fetchGroo.notification.updateAllNotifications({
        alertIdList: unreadAlertIds
      });

      setAlerts((prev) => prev.map((alert) => ({ ...alert, alertsCheckStatus: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to update all notifications:', error);
    }
  };

  // SSE 구독
  useEffect(() => {
    const eventSource = fetchGroo.notification.subscribe(
      (data: Alert) => {
        setAlerts((prev) => [data, ...prev]);
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

  // 드롭다운 열릴 때 데이터 조회
  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
      fetchUnreadCount();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* 배경 오버레이 */}
      <div className={styles.overlay} onClick={onClose} />

      {/* 알림 드롭다운 */}
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
              {alerts.slice(0, 20).map((alert) => (
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
