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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(newComment.trim());
      setNewComment('');
    } catch (error) {
      console.error('댓글 작성 실패:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 최상위 댓글만 필터링 (parentId가 null인 것들)
  const topLevelComments = comments.filter((comment) => !comment.parentId);

  // 특정 댓글의 대댓글 찾기
  const getReplies = (parentId: number) => {
    return comments.filter((comment) => comment.parentId === parentId);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>댓글</h3>
        <span className={styles.count}>{comments.length}</span>
      </div>

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
          topLevelComments.map((comment) => (
            <div key={comment.commentId}>
              {/* 부모 댓글 */}
              <CommentItem comment={comment} onUpdate={onUpdate} onDelete={onDelete} onReply={onSubmit} />

              {/* 해당 댓글의 대댓글들 */}
              {getReplies(comment.commentId).map((reply) => (
                <CommentItem
                  key={reply.commentId}
                  comment={reply}
                  onUpdate={onUpdate}
                  onDelete={onDelete}
                  onReply={onSubmit}
                />
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
