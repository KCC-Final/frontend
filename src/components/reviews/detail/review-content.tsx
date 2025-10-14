'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

import styles from './review-content.module.scss';

import { follow as followApi } from '@/apis/groo/follow';
import { ReviewDetailResDTO } from '@/types/reviews';

type Props = {
  reviewData: ReviewDetailResDTO['data'];
  isLiked: boolean;
  likeCount: number;
  onLike: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export default function ReviewContent({ reviewData, isLiked, likeCount, onLike, onEdit, onDelete }: Props) {
  const router = useRouter();
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    const checkFollowStatus = async () => {
      if (reviewData.isOwner) return;

      try {
        const response = await followApi.getFollowInfo(reviewData.userId);
        setIsFollowing(response.data !== null);
      } catch (error) {
        setIsFollowing(false);
      }
    };

    checkFollowStatus();
  }, [reviewData.userId, reviewData.isOwner]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  /**
   * @author uyh
   * @created 2025-10-13
   * 팔로우/언팔로우 토글 핸들러
   */
  const handleFollowToggle = async () => {
    if (followLoading) return;

    setFollowLoading(true);
    try {
      if (isFollowing) {
        await followApi.deleteFollow(reviewData.userId);
        setIsFollowing(false);
        alert('언팔로우 했습니다.');
      } else {
        await followApi.createFollow(reviewData.userId);
        setIsFollowing(true);
        alert('팔로우 했습니다.');
      }
    } catch (error: any) {
      console.error('팔로우 처리 실패:', error);

      if (error?.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert('팔로우 처리 중 오류가 발생했습니다.');
      }
    } finally {
      setFollowLoading(false);
    }
  };

  const handleUserClick = () => {
    router.push(`/my-feeds?userId=${reviewData.userId}`);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.userSection}>
          <div className={styles.userInfo}>
            <h3 className={styles.userId} onClick={handleUserClick}>
              {reviewData.userId}
            </h3>
            <p className={styles.date}>{formatDate(reviewData.createdAt)}</p>
          </div>
        </div>

        <div className={styles.actions}>
          {reviewData.isOwner ? (
            <>
              <button onClick={onEdit} className={styles.editButton}>
                수정
              </button>
              <button onClick={onDelete} className={styles.deleteButton}>
                삭제
              </button>
            </>
          ) : (
            <button
              onClick={handleFollowToggle}
              className={`${styles.followButton} ${isFollowing ? styles.following : ''}`}
              disabled={followLoading}>
              {isFollowing ? '언팔로우' : '팔로우'}
            </button>
          )}
        </div>
      </header>

      <article className={styles.content}>
        <h1 className={styles.title}>{reviewData.reviewTitle}</h1>
        <p className={styles.category}>{reviewData.category}</p>
        <div className={styles.body} dangerouslySetInnerHTML={{ __html: reviewData.reviewContent }} />
      </article>

      <footer className={styles.footer}>
        <button onClick={onLike} className={`${styles.likeButton} ${isLiked ? styles.liked : ''}`}>
          {isLiked ? '좋아요 취소' : '좋아요'} {likeCount}
        </button>
      </footer>
    </div>
  );
}
