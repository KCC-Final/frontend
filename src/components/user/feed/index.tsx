'use client';

import { Heart, Grid3x3 } from 'lucide-react';
import { useEffect, useState } from 'react';

import FollowListModal from './follow-list-modal';
import UserProfile from './profile';

import { fetchGroo } from '@/apis/groo';
import ReviewCard from '@/components/common/review-card';
import styles from '@/components/user/feed/user-feed.module.scss';
import { UserFeedData } from '@/types/user';
import { getReviewErrorMessage } from '@/utils/error/review-error-handler';

type TabType = 'myReviews' | 'likedReviews';

interface UserFeedProps {
  userId: string;
}

function UserFeed({ userId }: UserFeedProps) {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('myReviews');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedData, setFeedData] = useState<UserFeedData | null>(null);
  const [followModalOpen, setFollowModalOpen] = useState(false);
  const [followModalType, setFollowModalType] = useState<'follower' | 'following'>('follower');

  const loadFeedData = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!userId) {
        const [userResponse, myReviewsResponse, likedReviewsResponse] = await Promise.all([
          fetchGroo.user.getMyInfo(),
          fetchGroo.review.getMyReviews(),
          fetchGroo.review.getLikedReviews()
        ]);

        const myReviewsData = Array.isArray(myReviewsResponse)
          ? myReviewsResponse
          : myReviewsResponse?.data || [];

        const likedReviewsData = Array.isArray(likedReviewsResponse)
          ? likedReviewsResponse
          : likedReviewsResponse?.data || [];

        const feedData = {
          user: {
            userId: userResponse.data.userId,
            nickname: userResponse.data.nickname,
            profileImage: userResponse.data.profileImage,
            introduction: userResponse.data.introduction
          },
          stats: {
            reviewCount: myReviewsData.length,
            followerCount: 0,
            followingCount: 0
          },
          reviews: myReviewsData,
          likedReviews: likedReviewsData
        };

        setFeedData(feedData);

        const [followerCountResponse, followingCountResponse] = await Promise.all([
          fetchGroo.follow.getFollowerCount(),
          fetchGroo.follow.getFollowingCount()
        ]);

        setFeedData((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            stats: {
              ...prev.stats,
              followerCount: followerCountResponse.data,
              followingCount: followingCountResponse.data
            }
          };
        });
      } else {
        const feedResponse = await fetchGroo.user.getUserFeed(userId);
        setFeedData(feedResponse);
      }
    } catch (error: any) {
      const errorMessage = getReviewErrorMessage(error);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    loadFeedData();
  }, [userId]);

  const navBarHandler = (tab: TabType) => () => {
    setActiveTab(tab);
  };

  const handleFollowerClick = () => {
    setFollowModalType('follower');
    setFollowModalOpen(true);
  };

  const handleFollowingClick = () => {
    setFollowModalType('following');
    setFollowModalOpen(true);
  };

  if (!mounted || loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>로딩 중...</div>
      </div>
    );
  }

  if (error || !feedData) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>{error || '데이터를 불러올 수 없습니다.'}</div>
        <button onClick={loadFeedData} className={styles.retryButton}>
          다시 시도
        </button>
      </div>
    );
  }

  const isOwner = !userId;
  const displayReviews = activeTab === 'myReviews' ? feedData.reviews : feedData.likedReviews;

  return (
    <>
      <UserProfile
        user={feedData.user}
        reviewCount={feedData.stats.reviewCount}
        followerCount={feedData.stats.followerCount}
        followingCount={feedData.stats.followingCount}
        targetUserId={userId || undefined}
        isOwner={isOwner}
        onFollowerClick={handleFollowerClick}
        onFollowingClick={handleFollowingClick}
      />

      <nav className={styles.navbar}>
        <button
          className={`${styles.tabButton} ${activeTab === 'myReviews' ? styles.active : ''}`}
          onClick={navBarHandler('myReviews')}>
          <Grid3x3 size={20} />
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'likedReviews' ? styles.active : ''}`}
          onClick={navBarHandler('likedReviews')}>
          <Heart size={20} />
        </button>
      </nav>

      <ul className={styles.list}>
        {displayReviews.length > 0 ? (
          displayReviews.map((review) => <ReviewCard key={review.reviewId} review={review} size={3} />)
        ) : (
          <div className={styles.empty}>
            <p>
              {activeTab === 'myReviews'
                ? isOwner
                  ? '아직 작성된 독후감이 없습니다.'
                  : '작성된 독후감이 없습니다.'
                : isOwner
                  ? '아직 좋아요한 독후감이 없습니다.'
                  : '좋아요한 독후감이 없습니다.'}
            </p>
          </div>
        )}
      </ul>

      <FollowListModal
        isOpen={followModalOpen}
        onClose={() => setFollowModalOpen(false)}
        type={followModalType}
        targetUserId={userId || undefined}
      />
    </>
  );
}

export default UserFeed;
