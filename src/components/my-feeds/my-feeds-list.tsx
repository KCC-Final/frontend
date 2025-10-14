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
import { getReviewErrorMessage } from '@/utils/error/review-error-handler';

type TabType = 'myReviews' | 'likedReviews';

interface UserInfoState {
  nickname: string;
  profileImage: any;
  reviewCount: number;
  followerCount: number;
  followingCount: number;
}

export default function MyFeedsList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const targetUserId = searchParams.get('userId');

  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('myReviews');
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfoState | null>(null);
  const [followModalOpen, setFollowModalOpen] = useState(false);
  const [followModalType, setFollowModalType] = useState<'follower' | 'following'>('follower');

  useEffect(() => {
    setMounted(true);
    loadUserInfo();
  }, [targetUserId]);

  useEffect(() => {
    if (mounted) {
      loadReviews(activeTab);
    }
  }, [mounted, activeTab, targetUserId]);

  const loadUserInfo = async () => {
    try {
      if (!targetUserId) {
        const [userResponse, followerCountResponse, followingCountResponse, myReviewsResponse] =
          await Promise.all([
            fetchGroo.user.getMyInfo(),
            fetchGroo.follow.getFollowerCount(),
            fetchGroo.follow.getFollowingCount(),
            fetchGroo.review.getMyReviews()
          ]);

        const myReviewsData = Array.isArray(myReviewsResponse)
          ? myReviewsResponse
          : myReviewsResponse?.data || [];

        setUserInfo({
          nickname: userResponse.data.nickname,
          profileImage: userResponse.data.profileImage,
          reviewCount: myReviewsData.length,
          followerCount: followerCountResponse.data,
          followingCount: followingCountResponse.data
        });
      } else {
        const [targetReviewsResponse, targetFollowerCountResponse, targetFollowingCountResponse] =
          await Promise.all([
            fetchGroo.review.getReviewsByUserId(targetUserId),
            fetchGroo.follow.getUserFollowerCount(targetUserId),
            fetchGroo.follow.getUserFollowingCount(targetUserId)
          ]);

        const targetReviewsData = Array.isArray(targetReviewsResponse)
          ? targetReviewsResponse
          : targetReviewsResponse?.data || [];

        setUserInfo({
          nickname: targetUserId,
          profileImage: null,
          reviewCount: targetReviewsData.length,
          followerCount: targetFollowerCountResponse.data,
          followingCount: targetFollowingCountResponse.data
        });
      }
    } catch (error) {
      console.error('유저 정보 로드 실패:', error);
      setUserInfo({
        nickname: targetUserId || '사용자',
        profileImage: null,
        reviewCount: 0,
        followerCount: 0,
        followingCount: 0
      });
    }
  };

  const loadReviews = async (tab: TabType) => {
    setLoading(true);
    setError(null);

    try {
      let response;

      if (targetUserId) {
        if (tab === 'myReviews') {
          response = await fetchGroo.review.getReviewsByUserId(targetUserId);
        } else {
          response = await fetchGroo.review.getLikedReviewsByUserId(targetUserId);
        }
      } else {
        if (tab === 'myReviews') {
          response = await fetchGroo.review.getMyReviews();
        } else {
          response = await fetchGroo.review.getLikedReviews();
        }
      }

      let reviewsData: ReviewData[] = [];
      if (Array.isArray(response)) {
        reviewsData = response;
      } else if (response?.data) {
        reviewsData = response.data;
      } else {
        reviewsData = [];
      }

      setReviews(reviewsData);
    } catch (error: any) {
      const errorMessage = getReviewErrorMessage(error);
      setError(errorMessage);
      setReviews([]);
      console.error('독후감 목록 조회 실패:', error);
    } finally {
      setLoading(false);
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

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>{error}</div>
        <button onClick={() => loadReviews(activeTab)} className={styles.retryButton}>
          다시 시도
        </button>
      </div>
    );
  }

  const displayNickname = userInfo?.nickname || '사용자';
  const reviewCount = userInfo?.reviewCount || 0;
  const followerCount = userInfo?.followerCount || 0;
  const followingCount = userInfo?.followingCount || 0;
  const isOwner = !targetUserId;

  return (
    <div className={styles.container}>
      <UserProfileSection
        nickname={displayNickname}
        profileImage={userInfo?.profileImage}
        reviewCount={reviewCount}
        followerCount={followerCount}
        followingCount={followingCount}
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
        {reviews &&
          reviews.length > 0 &&
          reviews.map((review) => (
            <ReviewCard
              key={review.reviewId}
              review={review}
              onClick={handleReviewClick}
              showSecretBadge={activeTab === 'myReviews'}
            />
          ))}
      </div>

      {(!reviews || reviews.length === 0) && (
        <div className={styles.empty}>
          <p>
            {activeTab === 'myReviews'
              ? targetUserId
                ? '작성된 독후감이 없습니다.'
                : '아직 작성된 독후감이 없습니다.'
              : targetUserId
                ? '좋아요한 독후감이 없습니다.'
                : '아직 좋아요한 독후감이 없습니다.'}
          </p>
        </div>
      )}

      <FollowListModal
        isOpen={followModalOpen}
        onClose={() => setFollowModalOpen(false)}
        type={followModalType}
        targetUserId={targetUserId || undefined}
      />
    </div>
  );
}
