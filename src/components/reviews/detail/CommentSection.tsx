'use client';

import { useState } from 'react';

import CommentItem from './CommentItem';
import styles from './CommentSection.module.scss';

import { CommentData } from '@/types/reviews';
import { getReviewErrorMessage } from '@/utils/error/review-error-handler';

type Props = {
  comments: CommentData[];
  onSubmit: (content: string, parentId?: number) => Promise<void>;
  onUpdate: (commentId: number, content: string) => Promise<void>;
  onDelete: (commentId: number) => Promise<void>;
};

export default function CommentSection({ comments, onSubmit, onUpdate, onDelete }: Props) {
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');
  const [expandedComments, setExpandedComments] = useState<Set<number>>(new Set());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      await onSubmit(newComment.trim());
      setNewComment('');
    } catch (error: any) {
      const errorMsg = getReviewErrorMessage(error);
      setError(errorMsg);
      alert(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const topLevelComments = comments.filter((comment) => !comment.parentId);

  const getReplies = (parentId: number): CommentData[] => {
    return comments.filter((comment) => comment.parentId === parentId);
  };

  const getReplyCount = (parentId: number): number => {
    const directReplies = getReplies(parentId);
    let count = directReplies.length;

    directReplies.forEach((reply) => {
      count += getReplyCount(reply.commentId);
    });

    return count;
  };

  const toggleReplies = (commentId: number) => {
    setExpandedComments((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  const renderComment = (comment: CommentData, depth: number = 0) => {
    const replies = getReplies(comment.commentId);
    const replyCount = getReplyCount(comment.commentId);
    const showReplies = expandedComments.has(comment.commentId);

    return (
      <div key={comment.commentId}>
        <CommentItem
          comment={comment}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onReply={onSubmit}
          depth={depth}
          replyCount={replyCount}
          onToggleReplies={replyCount > 0 ? () => toggleReplies(comment.commentId) : undefined}
          showReplies={showReplies}
        />

        {showReplies && replies.length > 0 && (
          <div className={styles.replyContainer}>
            {replies.map((reply) => renderComment(reply, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>댓글</h2>
        <span className={styles.count}>{comments.length}</span>
      </div>

      {error && <div className={styles.errorMessage}>{error}</div>}

      <form onSubmit={handleSubmit} className={styles.commentForm}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="댓글을 입력하세요"
          className={styles.textarea}
          rows={3}
          disabled={isSubmitting}
        />
        <button type="submit" className={styles.submitBtn} disabled={isSubmitting || !newComment.trim()}>
          {isSubmitting ? '작성 중...' : '댓글 작성'}
        </button>
      </form>

      <div className={styles.commentList}>
        {comments.length === 0 ? (
          <div className={styles.empty}>첫 번째 댓글을 작성해보세요.</div>
        ) : (
          topLevelComments.map((comment) => renderComment(comment, 0))
        )}
      </div>
    </div>
  );
}
