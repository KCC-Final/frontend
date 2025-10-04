'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

import BookInfo from './BookInfo';
import CommentSection from './CommentSection';
import RelatedReviews from './RelatedReviews';
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
      } catch {
        setBookInfo(null);
      } finally {
        setLoadingBook(false);
      }
    };

    fetchBookInfo();
  }, [reviewData.isbn]);

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
    } catch {
      setIsLiked(previousLiked);
      setLikeCount(previousCount);
      alert('좋아요 처리 중 오류가 발생했습니다.');
    }
  };

  const handleEdit = () => {
    router.push(`/reviews/${reviewData.reviewId}/edit`);
  };

  const handleDelete = async () => {
    if (!confirm('정말 삭제하시겠습니까?')) {
      return;
    }

    try {
      await reviewApi.deleteReview(reviewData.reviewId);
      alert('독후감이 삭제되었습니다.');
      router.push('/reviews/feed');
    } catch {
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  const handleCommentSubmit = async (content: string, parentId?: number) => {
    try {
      await commentApi.createComment(reviewData.reviewId, { content, parentId });
      const updatedComments = await commentApi.getCommentsByReview(reviewData.reviewId);
      setComments(updatedComments);
    } catch {
      throw new Error('댓글 작성에 실패했습니다.');
    }
  };

  const handleCommentUpdate = async (commentId: number, content: string) => {
    try {
      await commentApi.updateComment(commentId, { content });
      const updatedComments = await commentApi.getCommentsByReview(reviewData.reviewId);
      setComments(updatedComments);
    } catch {
      throw new Error('댓글 수정에 실패했습니다.');
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
    } catch {
      throw new Error('댓글 삭제에 실패했습니다.');
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
