'use client';

import { User } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/shallow';

import { fetchGroo } from '@/apis';
import FollowButton from '@/components/common/button/follow';
import FollowListModal from '@/components/common/modal/follow';
import styles from '@/components/common/profile/profile.module.scss';
import useBoundStore from '@/stores';
import { devLogger } from '@/utils/dev-logger';
import { changeImageUrlFromBase64 } from '@/utils/format/base64';

type UserInfo = {
  userId: string;
  nickname: string;
  profileImage: string | null;
  introduction: string | null;
};

type UserStats = {
  reviewCount: number | null;
  followerCount: number;
  followingCount: number;
};

interface UserProfileCardProps {
  userId: string;
  user?: UserInfo;
  stats?: UserStats;
}

function UserProfileCard({ userId, user, stats }: UserProfileCardProps) {
  const { myInfo } = useBoundStore(useShallow((state) => ({ myInfo: state.myInfo! })));

  const [userInfo, setUserInfo] = useState<UserInfo>({
    userId,
    nickname: '',
    profileImage: null,
    introduction: null
  });
  const [userStats, setUserStats] = useState<UserStats>({
    reviewCount: null,
    followerCount: 0,
    followingCount: 0
  });

  const [followModalOpen, setFollowModalOpen] = useState(false);
  const [followModalType, setFollowModalType] = useState<'follower' | 'following'>('follower');

  const openModal = (type: 'follower' | 'following') => () => {
    setFollowModalType(type);
    setFollowModalOpen(true);
  };

  const closeModal = () => {
    setFollowModalOpen(false);
  };

  useEffect(() => {
    if (!user && myInfo.userId === userId) {
      setUserInfo({
        userId: myInfo.userId,
        nickname: myInfo.nickname,
        profileImage: myInfo.profileImage,
        introduction: myInfo.introduction
      });
    }
  }, [myInfo.introduction, myInfo.nickname, myInfo.profileImage, myInfo.userId, user, userId]);

  useEffect(() => {
    if (!stats && myInfo.userId === userId) {
      const loadFollowCountData = async () => {
        const [followerCountResponse, followingCountResponse] = await Promise.all([
          fetchGroo.follow.getFollowerCount(),
          fetchGroo.follow.getFollowingCount()
        ]);
        setUserStats({
          reviewCount: null,
          followerCount: followerCountResponse.data || 0,
          followingCount: followingCountResponse.data || 0
        });
      };
      loadFollowCountData();
    }
  }, [myInfo.userId, stats, userId]);

  useEffect(() => {
    if ((!user || !stats) && myInfo.userId !== userId) {
      const fetchUserFeedData = async () => {
        try {
          const feedResponse = await fetchGroo.user.getUserFeed(userId);
          setUserInfo({
            userId: feedResponse.user.userId,
            nickname: feedResponse.user.nickname,
            profileImage: feedResponse.user.profileImage,
            introduction: feedResponse.user.introduction
          });
          setUserStats({
            reviewCount: feedResponse.stats.reviewCount,
            followerCount: feedResponse.stats.followerCount,
            followingCount: feedResponse.stats.followingCount
          });
        } catch (error) {
          devLogger(error, true);
        }
      };

      fetchUserFeedData();
    }
  }, [myInfo.userId, stats, user, userId]);

  return (
    <section className={styles.container}>
      <div className={styles.image}>
        {changeImageUrlFromBase64(user ? user.profileImage : userInfo.profileImage) ? (
          <Image
            src={changeImageUrlFromBase64(user ? user.profileImage : userInfo.profileImage)}
            alt="user profile image"
            width={180}
            height={180}
          />
        ) : (
          <User size={85} color="#333333" />
        )}
      </div>
      <div className={styles.info}>
        <div className={styles.header}>
          <div className={styles.name}>
            <span className={styles.nickname}>{user ? user.nickname : userInfo.nickname}</span>
            <span className={styles.userId}>@{user ? user.userId : userInfo.userId}</span>
          </div>
          <FollowButton targetUserId={user ? user.userId : userInfo.userId} />
        </div>
        <div className={styles.follow}>
          {userStats.reviewCount !== null && (
            <button>
              <div className={styles.count}>{stats ? stats.reviewCount : userStats.reviewCount}</div>
              <div className={styles.label}>독후감</div>
            </button>
          )}
          <button onClick={openModal('following')}>
            <div className={styles.count}>{stats ? stats.followingCount : userStats.followingCount}</div>
            <div className={styles.label}>팔로잉</div>
          </button>
          <button onClick={openModal('follower')}>
            <div className={styles.count}>{stats ? stats.followerCount : userStats.followerCount}</div>
            <div className={styles.label}>팔로워</div>
          </button>
        </div>
        <div className={styles.introduction}>
          {user
            ? user.introduction
              ? user.introduction
              : '소개글이 없습니다.'
            : userInfo.introduction
              ? userInfo.introduction
              : '소개글이 없습니다.'}
        </div>
      </div>

      <FollowListModal
        isOpen={followModalOpen}
        closeModal={closeModal}
        type={followModalType}
        targetUserId={userId}
      />
    </section>
  );
}

export default UserProfileCard;
