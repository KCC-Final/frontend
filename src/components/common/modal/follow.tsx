'use client';

import { User, X } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { fetchGroo } from '@/apis/groo';
import FollowButton from '@/components/common/button/follow';
import styles from '@/components/common/modal/follow.module.scss';
import { FollowUserInfo } from '@/types';
import { devLogger } from '@/utils/dev-logger';
import { changeImageUrlFromBase64 } from '@/utils/format/base64';

interface FollowListModalProps {
  isOpen: boolean;
  closeModal: () => void;
  type: 'follower' | 'following';
  targetUserId: string;
}

function FollowListModal({ isOpen, closeModal, type, targetUserId }: FollowListModalProps) {
  const router = useRouter();

  const [users, setUsers] = useState<FollowUserInfo[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
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
        } catch (error) {
          devLogger(error, true);
        } finally {
          setLoading(false);
        }
      };

      loadUsers();
    }
  }, [isOpen, targetUserId, type]);

  const handleUserClick = (userId: string) => {
    router.push(`/users/${userId}`);
    closeModal();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={closeModal}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <header className={styles.header}>
          <h2 className={styles.title}>{type === 'follower' ? '팔로워' : '팔로잉'}</h2>
          <button className={styles.closeButton} onClick={closeModal}>
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
                return (
                  <li key={user.followId} className={styles.userItem}>
                    <div className={styles.userInfo} onClick={() => handleUserClick(user.userId)}>
                      <div className={styles.profileImage}>
                        {changeImageUrlFromBase64(user.profileImage) ? (
                          <Image
                            src={changeImageUrlFromBase64(user.profileImage)}
                            alt="user profile image"
                            width={48}
                            height={48}
                          />
                        ) : (
                          <User size={32} color="#333333" />
                        )}
                      </div>
                      <div className={styles.userDetails}>
                        <div className={styles.userNickname}>{user.nickname}</div>
                        <div className={styles.userId}>@{user.userId}</div>
                      </div>
                    </div>
                    <FollowButton targetUserId={user.userId} />
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

export default FollowListModal;
