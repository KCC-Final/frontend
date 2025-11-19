'use client';

import { Heart, Grid3x3 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/shallow';

import { fetchGroo } from '@/apis/groo';
import PageLoading from '@/components/common/loading';
import UserProfileCard from '@/components/common/profile/card';
import ReviewCard from '@/components/common/review-card';
import styles from '@/components/user/feed/user-feed.module.scss';
import useBoundStore from '@/stores';
import { UserFeedData } from '@/types/user';
import { getReviewErrorMessage } from '@/utils/error/review-error-handler';

type TabType = 'myReviews' | 'likedReviews';

interface UserFeedProps {
  userId: string;
}

function UserFeed({ userId }: UserFeedProps) {
  const { myInfo } = useBoundStore(useShallow((state) => ({ myInfo: state.myInfo })));

  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('myReviews');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedData, setFeedData] = useState<UserFeedData | null>(null);

  const updateFollowerCount = (amount: number) => {
    setFeedData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        stats: {
          ...prev.stats,
          followerCount: prev.stats.followerCount + amount
        }
      };
    });
  };

  const loadFeedData = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!userId) {
        const [myReviewsResponse, likedReviewsResponse, followerCountResponse, followingCountResponse] =
          await Promise.all([
            fetchGroo.review.getMyReviews(),
            fetchGroo.review.getLikedReviews(),
            fetchGroo.follow.getFollowerCount(),
            fetchGroo.follow.getFollowingCount()
          ]);

        const myReviewsData = Array.isArray(myReviewsResponse)
          ? myReviewsResponse
          : myReviewsResponse?.data || [];

        const likedReviewsData = Array.isArray(likedReviewsResponse)
          ? likedReviewsResponse
          : likedReviewsResponse?.data || [];

        if (!myInfo) {
          setFeedData(null);
        } else {
          const feedData = {
            user: {
              userId: myInfo.userId,
              nickname: myInfo.nickname,
              profileImage: myInfo.profileImage,
              introduction: myInfo.introduction
            },
            stats: {
              reviewCount: myReviewsData.length,
              followerCount: followerCountResponse.data,
              followingCount: followingCountResponse.data
            },
            reviews: myReviewsData,
            likedReviews: likedReviewsData
          };

          setFeedData(feedData);
        }
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

  if (!mounted || loading) {
    return <PageLoading />;
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
      <UserProfileCard
        userId={userId}
        user={feedData.user}
        stats={feedData.stats}
        onFollowChange={updateFollowerCount}
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
          displayReviews.map((review) => <ReviewCard key={review.reviewId} review={review} size={'md'} />)
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
    </>
  );
}

export default UserFeed;
