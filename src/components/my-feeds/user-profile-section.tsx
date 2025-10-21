'use client';

import { useEffect, useState } from 'react';

import styles from './user-profile-section.module.scss';

import { fetchGroo } from '@/apis/groo';
import { changeImageUrlFromBase64 } from '@/utils/format/base64';

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

  // Props 전체 로그
  console.log('[UserProfileSection] Props 전체:', {
    user,
    reviewCount,
    followerCount,
    followingCount,
    targetUserId,
    isOwner
  });

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

  if (!user) {
    console.log('[UserProfileSection] user가 없음!');
    return null;
  }

  // user.profileImage 상세 로그
  console.log('[UserProfileSection] user.profileImage 원본:', user.profileImage);
  console.log('[UserProfileSection] user.profileImage 타입:', typeof user.profileImage);
  console.log('[UserProfileSection] user.profileImage 길이:', user.profileImage?.length);

  if (user.profileImage) {
    console.log('[UserProfileSection] user.profileImage 시작 20자:', user.profileImage.substring(0, 20));
  }

  const convertedProfileImage = changeImageUrlFromBase64(user.profileImage);

  console.log('[UserProfileSection] 변환 결과:', {
    원본존재: !!user.profileImage,
    변환존재: !!convertedProfileImage,
    변환값길이: convertedProfileImage?.length
  });

  if (convertedProfileImage) {
    console.log('[UserProfileSection] 변환된 이미지 시작 50자:', convertedProfileImage.substring(0, 50));
  }

  console.log('[UserProfileSection] 최종 렌더링 상태:', {
    userId: user.userId,
    nickname: user.nickname,
    profileImage원본: user.profileImage ? `존재 (${user.profileImage.length}자)` : 'null',
    convertedProfileImage: convertedProfileImage ? `변환됨 (${convertedProfileImage.length}자)` : '변환실패'
  });

  return (
    <section className={styles.profileSection}>
      {convertedProfileImage ? (
        <img src={convertedProfileImage} alt={user.nickname} className={styles.profileImage} />
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
