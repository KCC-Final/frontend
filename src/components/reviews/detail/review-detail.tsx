'use client';

import { Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

import BookInfo from './BookInfo';
import CommentSection from './CommentSection';
import RelatedReviews from './RelatedReviews';
import ReviewContent from './review-content';
import styles from './review-detail.module.scss';

import { comment as commentApi } from '@/apis/groo/comment';
import { follow as followApi } from '@/apis/groo/follow';
import { review as reviewApi } from '@/apis/groo/review';
import UserProfileImage from '@/components/common/profile/image';
import { AladinBookDetailsItem } from '@/types';
import { ReviewDetailResDTO, CommentData } from '@/types/reviews';
import { getReviewErrorMessage } from '@/utils/error/review-error-handler';

type Props = {
  reviewData: ReviewDetailResDTO['data'];
  bookInfo: AladinBookDetailsItem | null;
  initialIsFollowing: boolean;
};

export default function ReviewDetail({ reviewData, bookInfo, initialIsFollowing }: Props) {
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(reviewData.liked);
  const [likeCount, setLikeCount] = useState(reviewData.likeCount);
  const [comments, setComments] = useState<CommentData[]>(reviewData.comments || []);
  const [showMenu, setShowMenu] = useState(false);
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [followLoading, setFollowLoading] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const handleLike = async () => {
    const previousLiked = isLiked;
    const previousCount = likeCount;

    try {
      if (isLiked) {
        setIsLiked(false);
        setLikeCount((prev) => prev - 1);
        await reviewApi.unlikeReview(reviewData.reviewId);
      } else {
        setIsLiked(true);
        setLikeCount((prev) => prev + 1);
        await reviewApi.likeReview(reviewData.reviewId);
      }
    } catch (error: any) {
      setIsLiked(previousLiked);
      setLikeCount(previousCount);
      alert(getReviewErrorMessage(error));
    }
  };

  const handleEdit = () => {
    setShowMenu(false);
    router.push(`/reviews/${reviewData.reviewId}/edit`);
  };

  const handleDelete = async () => {
    if (!confirm('정말 삭제하시겠습니까?')) {
      return;
    }

    try {
      setShowMenu(false);
      await reviewApi.deleteReview(reviewData.reviewId);
      alert('독후감이 삭제되었습니다.');
      router.push('/reviews/feed');
    } catch (error: any) {
      alert(getReviewErrorMessage(error));
    }
  };

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
      if (error?.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert('팔로우 처리 중 오류가 발생했습니다.');
      }
    } finally {
      setFollowLoading(false);
    }
  };

  const handleCommentSubmit = async (content: string, parentId?: number) => {
    try {
      await commentApi.createComment(reviewData.reviewId, { content, parentId });
      const updatedComments = await commentApi.getCommentsByReview(reviewData.reviewId);
      setComments(updatedComments);
    } catch (error: any) {
      alert(getReviewErrorMessage(error));
      throw error;
    }
  };

  const handleCommentUpdate = async (commentId: number, content: string) => {
    try {
      await commentApi.updateComment(commentId, { content });
      const updatedComments = await commentApi.getCommentsByReview(reviewData.reviewId);
      setComments(updatedComments);
    } catch (error: any) {
      alert(getReviewErrorMessage(error));
      throw error;
    }
  };

  const handleCommentDelete = async (commentId: number) => {
    if (!confirm('댓글을 삭제하시겠습니까?')) {
      return;
    }

    try {
      await commentApi.deleteComment(commentId);
      const updatedComments = await commentApi.getCommentsByReview(reviewData.reviewId);
      setComments(updatedComments);
    } catch (error: any) {
      alert(getReviewErrorMessage(error));
      throw error;
    }
  };

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

  const handleUserClick = () => {
    router.push(`/users/${reviewData.userId}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        {/* 독후감 제목 섹션 */}
        <div className={styles.titleSection}>
          <h1 className={styles.reviewTitle}>{reviewData.reviewTitle}</h1>
        </div>

        {/* 작성자 정보 섹션 */}
        <div className={styles.authorSection}>
          <div className={styles.authorInfo}>
            <div onClick={handleUserClick} style={{ cursor: 'pointer' }}>
              <UserProfileImage
                userId={reviewData.userId}
                profileImage={reviewData.authorProfileImage}
                size={40}
              />
            </div>
            <div className={styles.authorDetails}>
              <h3 className={styles.authorName} onClick={handleUserClick}>
                {reviewData.authorNickname || reviewData.userId}
              </h3>
              <p className={styles.date}>{formatDate(reviewData.createdAt)}</p>
            </div>
          </div>

          {/* 본인 글이면 점 3개 메뉴, 타인 글이면 팔로우 버튼 */}
          {reviewData.isOwner ? (
            <div className={styles.menuContainer} ref={menuRef}>
              <button onClick={() => setShowMenu(!showMenu)} className={styles.menuButton} aria-label="메뉴">
                <span className={styles.menuIcon}>⋮</span>
              </button>

              {showMenu && (
                <div className={styles.menuDropdown}>
                  <button onClick={handleEdit} className={styles.menuItem}>
                    수정
                  </button>
                  <button onClick={handleDelete} className={styles.menuItem}>
                    삭제
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={handleFollowToggle}
              className={`${styles.followButton} ${isFollowing ? styles.following : ''}`}
              disabled={followLoading}>
              {isFollowing ? '언팔로우' : '팔로우'}
            </button>
          )}
        </div>

        {/* 본문 내용 */}
        <ReviewContent reviewData={reviewData} />

        {/* 좋아요 버튼 */}
        <div className={styles.likeSection}>
          <button onClick={handleLike} className={`${styles.likeButton} ${isLiked ? styles.liked : ''}`}>
            <Heart className={styles.heartIcon} fill={isLiked ? 'currentColor' : 'none'} />
            <span className={styles.likeCount}>{likeCount}</span>
          </button>
        </div>

        {/* 도서 정보 - 좋아요 아래로 이동 */}
        <BookInfo bookInfo={bookInfo} loading={false} />

        {/* 관련 독후감 */}
        <RelatedReviews
          isbn={reviewData.isbn}
          category={reviewData.category}
          currentReviewId={reviewData.reviewId}
        />

        {/* 댓글 섹션 */}
        <CommentSection
          comments={comments}
          onSubmit={handleCommentSubmit}
          onUpdate={handleCommentUpdate}
          onDelete={handleCommentDelete}
        />
      </div>
    </div>
  );
}
