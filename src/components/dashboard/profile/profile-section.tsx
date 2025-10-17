'use client';

import { Bell, PenSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import styles from './profile-section.module.scss';

import { fetchGroo } from '@/apis/groo';
import FollowListModal from '@/components/my-feeds/follow-list-modal';

interface ProfileSectionProps {
  nickname: string;
  profileImage: string | null;
}

export default function ProfileSection({ nickname, profileImage }: ProfileSectionProps) {
  const router = useRouter();
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  const [isFollowerModalOpen, setIsFollowerModalOpen] = useState(false);
  const [isFollowingModalOpen, setIsFollowingModalOpen] = useState(false);

  //  팔로워/팔로잉 수 로드
  useEffect(() => {
    loadFollowCounts();
  }, []);

  const loadFollowCounts = async () => {
    try {
      const [followerRes, followingRes] = await Promise.all([
        fetchGroo.follow.getFollowerCount(),
        fetchGroo.follow.getFollowingCount()
      ]);

      setFollowerCount(followerRes.data || 0);
      setFollowingCount(followingRes.data || 0);
    } catch (error) {
      console.error('❌ 팔로워/팔로잉 수 로드 실패:', error);
      setFollowerCount(0);
      setFollowingCount(0);
    }
  };

  const handleWriteReview = () => {
    router.push('/reviews/write');
  };

  const handleNotificationSettings = () => {
    alert('알림 설정 기능은 준비중입니다.');
  };

  const getInitial = () => (nickname ? nickname.charAt(0).toUpperCase() : 'U');

  return (
    <div className={styles.profileSection}>
      <div className={styles.profileLeft}>
        <div className={styles.profileImage}>
          {profileImage ? <img src={profileImage} alt={nickname} /> : <span>{getInitial()}</span>}
        </div>

        <div className={styles.profileInfo}>
          <h2 className={styles.profileName}>{nickname}</h2>
          <div className={styles.profileStats}>
            <span onClick={() => setIsFollowerModalOpen(true)} className={styles.clickable}>
              팔로워 {followerCount.toLocaleString()}
            </span>
            <span className={styles.divider}>•</span>
            <span onClick={() => setIsFollowingModalOpen(true)} className={styles.clickable}>
              팔로잉 {followingCount.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.profileActions}>
        <button className={styles.btnPrimary} onClick={handleWriteReview}>
          <PenSquare size={18} />
          독후감 쓰기
        </button>
      </div>

      {/*  팔로워 / 팔로잉 모달 */}
      <FollowListModal
        isOpen={isFollowerModalOpen}
        onClose={() => setIsFollowerModalOpen(false)}
        type="follower"
      />
      <FollowListModal
        isOpen={isFollowingModalOpen}
        onClose={() => setIsFollowingModalOpen(false)}
        type="following"
      />
    </div>
  );
}
