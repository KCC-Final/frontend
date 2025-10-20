'use client';

import { useEffect, useState } from 'react';

import styles from './user-profile-section.module.scss';

import { fetchGroo } from '@/apis/groo';

interface UserProfileSectionProps {
  user: {
    userId: string;
    nickname: string;
    profileImage: string | null;
    introduction: string | null;
  };
  reviewCount: number;
  followerCount: number;
  followingCount: number;
  targetUserId?: string;
  isOwner: boolean;
  onFollowerClick: () => void;
  onFollowingClick: () => void;
}

export default function UserProfileSection({
  user,
  reviewCount,
  followerCount,
  followingCount,
  targetUserId,
  isOwner,
  onFollowerClick,
  onFollowingClick
}: UserProfileSectionProps) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOwner && targetUserId) {
      checkFollowStatus();
    }
  }, [targetUserId, isOwner]);

  const checkFollowStatus = async () => {
    if (!targetUserId) return;

    try {
      const response = await fetchGroo.follow.getFollowInfo(targetUserId);
      setIsFollowing(response.data !== null);
    } catch {
      setIsFollowing(false);
    }
  };

  const handleFollowToggle = async () => {
    if (!targetUserId || loading) return;

    setLoading(true);
    try {
      if (isFollowing) {
        await fetchGroo.follow.deleteFollow(targetUserId);
        setIsFollowing(false);
        alert('언팔로우 했습니다.');
      } else {
        await fetchGroo.follow.createFollow(targetUserId);
        setIsFollowing(true);
        alert('팔로우 했습니다.');
      }
    } catch (error: any) {
      console.error('팔로우 처리 실패:', error);
      alert(error?.response?.data?.message || '팔로우 처리 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const getInitial = (name: string) => (name ? name.charAt(0).toUpperCase() : 'U');

  if (!user) return null;

  return (
    <section className={styles.profileSection}>
      {user.profileImage ? (
        <img src={user.profileImage} alt={user.nickname} className={styles.profileImage} />
      ) : (
        <div className={styles.profilePlaceholder}>{getInitial(user.nickname)}</div>
      )}

      <div className={styles.profileInfo}>
        <h2 className={styles.profileNickname}>{user.nickname}</h2>
        <p className={styles.profileUserId}>@{user.userId}</p>
      </div>

      {!isOwner && targetUserId && (
        <button
          className={`${styles.followActionButton} ${isFollowing ? styles.following : ''}`}
          onClick={handleFollowToggle}
          disabled={loading}>
          {loading ? '처리중...' : isFollowing ? '언팔로우' : '팔로우'}
        </button>
      )}

      <div className={styles.statsContainer}>
        <div className={styles.statItem}>
          <span className={styles.statValue}>{reviewCount}</span>
          <span className={styles.statLabel}>독후감</span>
        </div>
        <div className={styles.statItem} onClick={onFollowerClick} style={{ cursor: 'pointer' }}>
          <span className={styles.statValue}>{followerCount}</span>
          <span className={styles.statLabel}>팔로워</span>
        </div>
        <div className={styles.statItem} onClick={onFollowingClick} style={{ cursor: 'pointer' }}>
          <span className={styles.statValue}>{followingCount}</span>
          <span className={styles.statLabel}>팔로잉</span>
        </div>
      </div>
    </section>
  );
}
