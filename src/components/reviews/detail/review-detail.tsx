'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

import BookInfo from './BookInfo';
import CommentSection from './CommentSection';
import RelatedReviews from './RelatedReviews'; // 추가
import ReviewContent from './review-content';
import styles from './review-detail.module.scss';

import { fetchAladin } from '@/apis';
import { comment as commentApi } from '@/apis/groo/comment';
import { review as reviewApi } from '@/apis/groo/review';
import { ReviewDetailResDTO, CommentData, AladinBook } from '@/types/reviews';

type Props = {
  reviewData: ReviewDetailResDTO['data'];
};

export default function ReviewDetail({ reviewData }: Props) {
  const router = useRouter();
  const [bookInfo, setBookInfo] = useState<AladinBook | null>(null);
  const [loadingBook, setLoadingBook] = useState(true);
  const [isLiked, setIsLiked] = useState(reviewData.liked);
  const [likeCount, setLikeCount] = useState(reviewData.likeCount);
  const [comments, setComments] = useState<CommentData[]>(reviewData.comments || []);

  useEffect(() => {
    const fetchBookInfo = async () => {
      try {
        const response = await fetchAladin.getBookDetails(reviewData.isbn);
        if (response.item && response.item.length > 0) {
          setBookInfo(response.item[0]);
        }
      } catch (error) {
        console.error('책 정보 불러오기 실패:', error);
      } finally {
        setLoadingBook(false);
      }
    };

    fetchBookInfo();
  }, [reviewData.isbn]);

  const handleLike = async () => {
    try {
      if (isLiked) {
        await reviewApi.unlikeReview(reviewData.reviewId);
        setIsLiked(false);
        setLikeCount((prev) => prev - 1);
      } else {
        await reviewApi.likeReview(reviewData.reviewId);
        setIsLiked(true);
        setLikeCount((prev) => prev + 1);
      }
    } catch (error) {
      console.error('좋아요 처리 실패:', error);
      alert('좋아요 처리 중 오류가 발생했습니다.');
    }
  };

  const handleEdit = () => {
    router.push(`/reviews/${reviewData.reviewId}/edit`);
  };

  const handleDelete = async () => {
    if (confirm('정말 삭제하시겠습니까?')) {
      try {
        await reviewApi.deleteReview(reviewData.reviewId);
        alert('독후감이 삭제되었습니다.');
        router.push('/reviews/feed');
      } catch (error) {
        console.error('삭제 실패:', error);
        alert('삭제 중 오류가 발생했습니다.');
      }
    }
  };

  const handleCommentSubmit = async (content: string, parentId?: number) => {
    try {
      await commentApi.createComment(reviewData.reviewId, { content, parentId });
      const updatedComments = await commentApi.getCommentsByReview(reviewData.reviewId);
      console.log('Updated comments:', updatedComments);
      setComments(updatedComments);
    } catch (error) {
      console.error('댓글 작성 실패:', error);
      alert('댓글 작성 중 오류가 발생했습니다.');
    }
  };

  const handleCommentUpdate = async (commentId: number, content: string) => {
    try {
      await commentApi.updateComment(commentId, { content });
      const updatedComments = await commentApi.getCommentsByReview(reviewData.reviewId);
      console.log('Updated comments:', updatedComments);
      setComments(updatedComments);
    } catch (error) {
      console.error('댓글 수정 실패:', error);
      alert('댓글 수정 중 오류가 발생했습니다.');
    }
  };

  const handleCommentDelete = async (commentId: number) => {
    if (confirm('댓글을 삭제하시겠습니까?')) {
      try {
        await commentApi.deleteComment(commentId);
        const updatedComments = await commentApi.getCommentsByReview(reviewData.reviewId);
        console.log('Updated comments:', updatedComments);
        setComments(updatedComments);
      } catch (error) {
        console.error('댓글 삭제 실패:', error);
        alert('댓글 삭제 중 오류가 발생했습니다.');
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        <BookInfo bookInfo={bookInfo} loading={loadingBook} />

        <ReviewContent
          reviewData={reviewData}
          isLiked={isLiked}
          likeCount={likeCount}
          onLike={handleLike}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/* 관련 독후감 섹션 추가 */}
        <RelatedReviews
          isbn={reviewData.isbn}
          category={reviewData.category}
          currentReviewId={reviewData.reviewId}
        />

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
