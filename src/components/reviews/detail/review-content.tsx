'use client';

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

/**
 * @author uyh
 * @created 2025-10-13
 * 독후감 컨텐츠 컴포넌트
 */
export default function ReviewContent({ reviewData, isLiked, likeCount, onLike, onEdit, onDelete }: Props) {
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

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <h1 className={styles.title}>{reviewData.reviewTitle}</h1>

          {reviewData.isOwner && (
            <div className={styles.actions}>
              <button onClick={onEdit} className={styles.editBtn}>
                수정
              </button>
              <button onClick={onDelete} className={styles.deleteBtn}>
                삭제
              </button>
            </div>
          )}
        </div>

        <div className={styles.metadata}>
          <div className={styles.authorSection}>
            <span className={styles.author}>{reviewData.userId}</span>
            {!reviewData.isOwner && (
              <button
                onClick={handleFollowToggle}
                disabled={followLoading}
                className={`${styles.followButton} ${isFollowing ? styles.following : ''}`}>
                {followLoading ? '처리중...' : isFollowing ? '언팔로우' : '팔로우'}
              </button>
            )}
          </div>
          <span className={styles.date}>{formatDate(reviewData.createdAt)}</span>
          {reviewData.updatedAt && reviewData.updatedAt !== reviewData.createdAt && (
            <>
              <span className={styles.separator}>•</span>
              <span className={styles.updated}>수정됨</span>
            </>
          )}
          {reviewData.secret && (
            <>
              <span className={styles.separator}>•</span>
              <span className={styles.secret}>비밀글</span>
            </>
          )}
        </div>
      </div>

      <div className={styles.content}>
        <div
          className={styles.reviewText}
          dangerouslySetInnerHTML={{
            __html: reviewData.reviewContent.replace(/\n/g, '<br />')
          }}
        />
      </div>

      <div className={styles.footer}>
        <button onClick={onLike} className={`${styles.likeBtn} ${isLiked ? styles.liked : ''}`}>
          <span className={styles.likeIcon}>{isLiked ? '♥' : '♡'}</span>
          <span className={styles.likeCount}>{likeCount}</span>
        </button>
      </div>
    </div>
  );
}
