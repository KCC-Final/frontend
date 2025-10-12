'use client';

import { useState } from 'react';

import styles from './CommentItem.module.scss';

import { CommentData } from '@/types/reviews';
import { getReviewErrorMessage } from '@/utils/error/review-error-handler';

type Props = {
  comment: CommentData;
  onUpdate: (commentId: number, content: string) => Promise<void>;
  onDelete: (commentId: number) => Promise<void>;
  onReply: (content: string, parentId: number) => Promise<void>;
  depth?: number; // 댓글 깊이 추가
};

export default function CommentItem({ comment, onUpdate, onDelete, onReply, depth = 0 }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [error, setError] = useState<string>('');
  const MAX_DEPTH = 5; // 최대 뎁스 설정

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return '방금 전';
      if (diffMins < 60) return `${diffMins}분 전`;
      if (diffHours < 24) return `${diffHours}시간 전`;
      if (diffDays < 7) return `${diffDays}일 전`;

      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  // handleUpdateSubmit 함수 수정
  const handleUpdateSubmit = async () => {
    if (!editContent.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }

    try {
      setError('');
      await onUpdate(comment.commentId, editContent.trim());
      setIsEditing(false);
    } catch (error: any) {
      const errorMsg = getReviewErrorMessage(error);
      setError(errorMsg);
      alert(errorMsg);
    }
  };

  // handleReplySubmit 함수 수정
  const handleReplySubmit = async () => {
    if (!replyContent.trim()) {
      alert('답글 내용을 입력해주세요.');
      return;
    }

    try {
      setError('');
      await onReply(replyContent.trim(), comment.commentId);
      setReplyContent('');
      setIsReplying(false);
    } catch (error: any) {
      const errorMsg = getReviewErrorMessage(error);
      setError(errorMsg);
      alert(errorMsg);
    }
  };

  // handleDelete 함수 수정
  const handleDelete = async () => {
    try {
      setError('');
      await onDelete(comment.commentId);
    } catch (error: any) {
      const errorMsg = getReviewErrorMessage(error);
      setError(errorMsg);
      alert(errorMsg);
    }
  };

  const isEdited = comment.updatedAt && comment.updatedAt !== comment.createdAt;
  const displayDate = isEdited ? comment.updatedAt : comment.createdAt;

  // 깊이에 따른 왼쪽 여백 계산 (최대 5단계까지)
  const marginLeft = Math.min(depth, 5) * 40;

  return (
    <div
      className={`${styles.container} ${depth > 0 ? styles.reply : ''}`}
      style={{ marginLeft: `${marginLeft}px` }}>
      {error && <div className={styles.errorMessage}>{error}</div>}

      <div className={styles.header}>
        <span className={styles.author}>{comment.userId}</span>
        <span className={styles.date}>
          {formatDate(displayDate)}
          {isEdited && ' (수정됨)'}
        </span>
      </div>

      {isEditing ? (
        <div className={styles.editForm}>
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className={styles.textarea}
            rows={3}
          />
          <div className={styles.editActions}>
            <button onClick={handleUpdateSubmit} className={styles.saveBtn}>
              저장
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setEditContent(comment.content);
                setError('');
              }}
              className={styles.cancelBtn}>
              취소
            </button>
          </div>
        </div>
      ) : (
        <>
          <p className={styles.content}>{comment.content}</p>

          <div className={styles.actions}>
            {depth < MAX_DEPTH && (
              <button onClick={() => setIsReplying(!isReplying)} className={styles.actionBtn}>
                답글
              </button>
            )}
            {comment.isOwner && (
              <>
                <button onClick={() => setIsEditing(true)} className={styles.actionBtn}>
                  수정
                </button>
                <button onClick={handleDelete} className={styles.actionBtn}>
                  삭제
                </button>
              </>
            )}
          </div>
        </>
      )}

      {isReplying && (
        <div className={styles.replyForm}>
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="답글을 입력하세요"
            className={styles.textarea}
            rows={2}
          />
          <div className={styles.replyActions}>
            <button onClick={handleReplySubmit} className={styles.submitBtn}>
              답글 작성
            </button>
            <button
              onClick={() => {
                setIsReplying(false);
                setReplyContent('');
                setError('');
              }}
              className={styles.cancelBtn}>
              취소
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
