'use client';

import { Bell, Heart, MessageCircle, UserPlus, Award, Check, MoreVertical } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';

import styles from './notification.module.scss';

import { fetchGroo } from '@/apis';
import { useNotificationStore } from '@/stores/notification';
import { Alert, NotificationType } from '@/types/notification';

// ===============================
//  Notification Item
// ===============================
interface NotificationItemProps {
  alert: Alert;
  index: number;
  total: number;
  onRead: (alertId: number) => void;
  onDelete: (alertId: number) => void;
}

function NotificationItem({ alert, index, total, onRead, onDelete }: NotificationItemProps) {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

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

  const handleContentClick = () => {
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

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const menuWidth = 140;

      setMenuPosition({
        top: rect.bottom + 4,
        left: rect.right - menuWidth
      });
    }

    setShowMenu(!showMenu);
  };

  const handleMarkAsRead = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!alert.alertsCheckStatus) {
      await onRead(alert.alertId);
    }
    setShowMenu(false);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await onDelete(alert.alertId);
    setShowMenu(false);
  };

  return (
    <div className={`${styles.notification_item} ${!alert.alertsCheckStatus ? styles.unread : ''}`}>
      <div className={styles.clickable_area} onClick={handleContentClick}>
        <div className={styles.icon_wrapper}>{getIcon(alert.type)}</div>
        <div className={styles.content}>
          <p className={styles.message}>{alert.content}</p>
          <span className={styles.time}>{formatTime(alert.sendAt || alert.sendAt)}</span>
        </div>
        {!alert.alertsCheckStatus && <div className={styles.unread_dot} />}
      </div>

      <div className={styles.menu_wrapper} ref={menuRef}>
        <button ref={buttonRef} className={styles.menu_button} onClick={handleMenuClick} aria-label="메뉴">
          <MoreVertical size={18} />
        </button>

        {showMenu && (
          <div
            className={styles.menu_dropdown_modal}
            style={{
              position: 'fixed',
              top: `${menuPosition.top}px`,
              left: `${menuPosition.left}px`,
              zIndex: 9999
            }}>
            {!alert.alertsCheckStatus && (
              <button className={styles.menu_item} onClick={handleMarkAsRead}>
                읽음 처리
              </button>
            )}
            <button className={styles.menu_item} onClick={handleDelete}>
              삭제
            </button>
          </div>
        )}
      </div>
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

  const handleDeleteNotification = async (alertId: number) => {
    try {
      await fetchGroo.notification.deleteNotification(alertId);

      const deletedAlert = alerts.find((a) => a.alertId === alertId);
      setAlerts(alerts.filter((alert) => alert.alertId !== alertId));

      if (deletedAlert && !deletedAlert.alertsCheckStatus) {
        setUnreadCount(Math.max(0, unreadCount - 1));
      }
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
              {alerts.map((alert, index) => (
                <NotificationItem
                  key={alert.alertId}
                  alert={alert}
                  index={index}
                  total={alerts.length}
                  onRead={handleReadNotification}
                  onDelete={handleDeleteNotification}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default NotificationDropdown;
