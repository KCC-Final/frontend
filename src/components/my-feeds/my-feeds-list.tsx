'use client';

import { Heart, Grid3x3 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import styles from './my-feeds-list.module.scss';

import { fetchGroo } from '@/apis/groo';
import FollowListModal from '@/components/my-feeds/follow-list-modal';
import UserProfileSection from '@/components/my-feeds/user-profile-section';
import ReviewCard from '@/components/reviews/commons/review-card';
import { ReviewData } from '@/types/reviews';
import { UserFeedData } from '@/types/user';
import { getReviewErrorMessage } from '@/utils/error/review-error-handler';

type TabType = 'myReviews' | 'likedReviews';

export default function MyFeedsList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const targetUserId = searchParams.get('userId');

  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('myReviews');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedData, setFeedData] = useState<UserFeedData | null>(null);
  const [followModalOpen, setFollowModalOpen] = useState(false);
  const [followModalType, setFollowModalType] = useState<'follower' | 'following'>('follower');

  useEffect(() => {
    setMounted(true);
    loadFeedData();
  }, [targetUserId]);

  // src/components/my-feeds/my-feeds-list.tsx

  const loadFeedData = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('=== Feed Data Loading Start ===');
      console.log('targetUserId:', targetUserId);

      if (!targetUserId) {
        console.log('내 피드 로드 - 여러 API 조합');

        const [userResponse, myReviewsResponse, likedReviewsResponse] = await Promise.all([
          fetchGroo.user.getMyInfo(),
          fetchGroo.review.getMyReviews(),
          fetchGroo.review.getLikedReviews()
        ]);

        console.log('userResponse:', userResponse);
        console.log('myReviewsResponse:', myReviewsResponse);
        console.log('likedReviewsResponse:', likedReviewsResponse);

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

        console.log('내 피드 데이터 조합 완료:', feedData);
        setFeedData(feedData);

        // 팔로워/팔로잉 수 별도 조회
        const [followerCountResponse, followingCountResponse] = await Promise.all([
          fetchGroo.follow.getFollowerCount(),
          fetchGroo.follow.getFollowingCount()
        ]);

        console.log('followerCount:', followerCountResponse.data);
        console.log('followingCount:', followingCountResponse.data);

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
        console.log('다른 유저 피드 로드 - 통합 API 1번 호출');
        console.log('API URL:', `/users/${targetUserId}/feed`);

        const feedResponse = await fetchGroo.user.getUserFeed(targetUserId);

        setFeedData(feedResponse);
        console.log('피드 데이터 설정 완료');
      }

      console.log('=== Feed Data Loading Success ===');
    } catch (error: any) {
      console.error('=== Feed Data Loading Error ===');
      console.error('Error 객체:', error);
      console.error('Error response:', error?.response);
      console.error('Error data:', error?.response?.data);

      const errorMessage = getReviewErrorMessage(error);
      console.error('처리된 에러 메시지:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
      console.log('=== Feed Data Loading End ===');
    }
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  const handleReviewClick = (reviewId: number) => {
    router.push(`/reviews/${reviewId}`);
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

  const isOwner = !targetUserId;
  const displayReviews = activeTab === 'myReviews' ? feedData.reviews : feedData.likedReviews;

  return (
    <div className={styles.container}>
      <UserProfileSection
        user={feedData.user}
        reviewCount={feedData.stats.reviewCount}
        followerCount={feedData.stats.followerCount}
        followingCount={feedData.stats.followingCount}
        targetUserId={targetUserId || undefined}
        isOwner={isOwner}
        onFollowerClick={handleFollowerClick}
        onFollowingClick={handleFollowingClick}
      />

      <nav className={styles.tabNav}>
        <button
          className={`${styles.tabButton} ${activeTab === 'myReviews' ? styles.active : ''}`}
          onClick={() => handleTabChange('myReviews')}>
          <Grid3x3 size={20} />
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'likedReviews' ? styles.active : ''}`}
          onClick={() => handleTabChange('likedReviews')}>
          <Heart size={20} />
        </button>
      </nav>

      <div className={styles.feedGrid}>
        {displayReviews.length > 0 ? (
          displayReviews.map((review) => (
            <ReviewCard
              key={review.reviewId}
              review={review}
              onClick={handleReviewClick}
              showSecretBadge={activeTab === 'myReviews' && isOwner}
            />
          ))
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
      </div>

      <FollowListModal
        isOpen={followModalOpen}
        onClose={() => setFollowModalOpen(false)}
        type={followModalType}
        targetUserId={targetUserId || undefined}
      />
    </div>
  );
}
