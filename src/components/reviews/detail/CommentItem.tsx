'use client';

import { useState, useRef, useEffect } from 'react';

import styles from './CommentItem.module.scss';

import UserProfileImage from '@/components/common/profile/image';
import { CommentData } from '@/types/reviews';
import { getReviewErrorMessage } from '@/utils/error/review-error-handler';

type Props = {
  comment: CommentData;
  onUpdate: (commentId: number, content: string) => Promise<void>;
  onDelete: (commentId: number) => Promise<void>;
  onReply: (content: string, parentId: number) => Promise<void>;
  depth?: number;
  replyCount?: number;
  onToggleReplies?: () => void;
  showReplies?: boolean;
};

export default function CommentItem({
  comment,
  onUpdate,
  onDelete,
  onReply,
  depth = 0,
  replyCount = 0,
  onToggleReplies,
  showReplies = false
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [error, setError] = useState<string>('');
  const [showMenu, setShowMenu] = useState(false);
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

  const handleUpdateSubmit = async () => {
    if (!editContent.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }

    try {
      setError('');
      await onUpdate(comment.commentId, editContent.trim());
      setIsEditing(false);
      setShowMenu(false);
    } catch (error: any) {
      const errorMsg = getReviewErrorMessage(error);
      setError(errorMsg);
      alert(errorMsg);
    }
  };

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

  const handleDelete = async () => {
    try {
      setError('');
      setShowMenu(false);
      await onDelete(comment.commentId);
    } catch (error: any) {
      const errorMsg = getReviewErrorMessage(error);
      setError(errorMsg);
      alert(errorMsg);
    }
  };

  const isEdited = comment.updatedAt && comment.updatedAt !== comment.createdAt;
  const displayDate = isEdited ? comment.updatedAt : comment.createdAt;
  const marginLeft = Math.min(depth, 5) * 40;

  return (
    <div
      className={`${styles.container} ${depth > 0 ? styles.reply : ''}`}
      style={{ marginLeft: `${marginLeft}px` }}>
      {error && <div className={styles.errorMessage}>{error}</div>}

      <div className={styles.header}>
        <div className={styles.authorInfo}>
          <UserProfileImage userId={comment.userId} profileImage={comment.authorProfileImage} size={32} />

          <div className={styles.authorDetails}>
            <span className={styles.author}>{comment.authorNickname || comment.userId}</span>
            <span className={styles.date}>
              {formatDate(displayDate)}
              {isEdited && ' (수정됨)'}
            </span>
          </div>
        </div>

        {comment.isOwner && (
          <div className={styles.menuContainer} ref={menuRef}>
            <button onClick={() => setShowMenu(!showMenu)} className={styles.menuButton} aria-label="메뉴">
              <span className={styles.menuIcon}>⋮</span>
            </button>

            {showMenu && (
              <div className={styles.menuDropdown}>
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setShowMenu(false);
                  }}
                  className={styles.menuItem}>
                  수정
                </button>
                <button onClick={handleDelete} className={styles.menuItem}>
                  삭제
                </button>
              </div>
            )}
          </div>
        )}
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
            {depth === 0 && (
              <button onClick={() => setIsReplying(!isReplying)} className={styles.replyBtn}>
                답글
              </button>
            )}

            {replyCount > 0 && onToggleReplies && (
              <button onClick={onToggleReplies} className={styles.toggleRepliesBtn}>
                <span className={styles.toggleIcon}>{showReplies ? '▼' : '▶'}</span>
                답글 {replyCount}개
              </button>
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
