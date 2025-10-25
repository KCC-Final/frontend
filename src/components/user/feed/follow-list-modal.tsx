'use client';

import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { fetchGroo } from '@/apis/groo';
import styles from '@/components/user/feed/follow-list-modal.module.scss';
import useBoundStore from '@/stores';

interface FollowUser {
  followId: number;
  userId: string;
  nickname: string;
  profileImage: string | null;
  followedAt: string;
}

interface FollowListModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'follower' | 'following';
  targetUserId?: string;
}

export default function FollowListModal({ isOpen, onClose, type, targetUserId }: FollowListModalProps) {
  const router = useRouter();
  const [users, setUsers] = useState<FollowUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [followStates, setFollowStates] = useState<{ [key: string]: boolean }>({});

  // Zustand 스토어에서 내 userId 가져오기 (타입 단언 사용)
  const myUserId = useBoundStore((state) => (state as any).myInfo?.userId);

  useEffect(() => {
    if (isOpen) {
      loadUsers();
    }
  }, [isOpen, type]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      let response;

      if (targetUserId) {
        response =
          type === 'follower'
            ? await fetchGroo.follow.getUserFollowerList(targetUserId)
            : await fetchGroo.follow.getUserFollowingList(targetUserId);
      } else {
        response =
          type === 'follower'
            ? await fetchGroo.follow.getFollowerList()
            : await fetchGroo.follow.getFollowingList();
      }

      const userList = response.data || [];
      setUsers(userList);

      // 각 유저의 팔로우 상태 확인
      const states: { [key: string]: boolean } = {};
      await Promise.all(
        userList.map(async (user) => {
          try {
            const followInfo = await fetchGroo.follow.getFollowInfo(user.userId);
            states[user.userId] = followInfo.data !== null;
          } catch {
            states[user.userId] = false;
          }
        })
      );
      setFollowStates(states);
    } catch (error) {
      console.error('팔로우 리스트 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollowToggle = async (userId: string) => {
    try {
      const isFollowing = followStates[userId];

      if (isFollowing) {
        await fetchGroo.follow.deleteFollow(userId);
        setFollowStates((prev) => ({ ...prev, [userId]: false }));
      } else {
        await fetchGroo.follow.createFollow(userId);
        setFollowStates((prev) => ({ ...prev, [userId]: true }));
      }
    } catch (error) {
      console.error('팔로우 처리 실패:', error);
      alert('팔로우 처리 중 오류가 발생했습니다.');
    }
  };

  const handleUserClick = (userId: string) => {
    router.push(`/users/${userId}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <header className={styles.header}>
          <h2 className={styles.title}>{type === 'follower' ? '팔로워' : '팔로잉'}</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={24} />
          </button>
        </header>

        <div className={styles.content}>
          {loading ? (
            <div className={styles.loading}>로딩 중...</div>
          ) : users.length === 0 ? (
            <div className={styles.empty}>
              {type === 'follower' ? '팔로워가 없습니다.' : '팔로잉 중인 유저가 없습니다.'}
            </div>
          ) : (
            <ul className={styles.userList}>
              {users.map((user) => {
                const isMe = user.userId === myUserId; // 본인 확인

                return (
                  <li key={user.followId} className={styles.userItem}>
                    <div className={styles.userInfo} onClick={() => handleUserClick(user.userId)}>
                      <div className={styles.userAvatar}>{user.nickname[0]?.toUpperCase() || 'U'}</div>
                      <div className={styles.userDetails}>
                        <div className={styles.userNickname}>{user.nickname}</div>
                        <div className={styles.userId}>@{user.userId}</div>
                      </div>
                    </div>
                    {/* 본인이 아닐 때만 팔로우 버튼 표시 */}
                    {!isMe && (
                      <button
                        className={`${styles.followButton} ${
                          followStates[user.userId] ? styles.following : ''
                        }`}
                        onClick={() => handleFollowToggle(user.userId)}>
                        {followStates[user.userId] ? '언팔로우' : '팔로우'}
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
