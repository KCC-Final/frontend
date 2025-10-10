'use client';

import { useState } from 'react';

import CommentItem from './CommentItem';
import styles from './CommentSection.module.scss';

import { CommentData } from '@/types/reviews';

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
    } catch (error) {
      setError('댓글 작성에 실패했습니다.');
      alert('댓글 작성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 최상위 댓글만 필터링
  const topLevelComments = comments.filter((comment) => !comment.parentId);

  // 특정 댓글의 답글 가져오기
  const getReplies = (parentId: number): CommentData[] => {
    return comments.filter((comment) => comment.parentId === parentId);
  };

  // 재귀적으로 댓글 렌더링
  const renderComment = (comment: CommentData, depth: number = 0) => {
    const replies = getReplies(comment.commentId);

    return (
      <div key={comment.commentId}>
        <CommentItem
          comment={comment}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onReply={onSubmit}
          depth={depth}
        />

        {/* 답글들을 재귀적으로 렌더링 */}
        {replies.length > 0 && (
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
        <h3 className={styles.title}>댓글</h3>
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
