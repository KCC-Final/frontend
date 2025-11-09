'use client';

import { Lock } from 'lucide-react';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';

import styles from './GroupCommentItem.module.scss';

import { group } from '@/apis/groo/group';
import { user } from '@/apis/groo/user';
import UserProfileImage from '@/components/common/profile/image';

interface Props {
  comment: any;
  depth: number;
  groupId: number;
  currentUserId: string | null;
  isOwner: boolean;
  refreshComments: () => Promise<void>;
  replyCount?: number;
  showReplies?: boolean;
  onToggleReplies?: () => void;
}

const nicknameCache = new Map<string, { nickname: string; profileImage?: string }>();

export default function GroupCommentItem({
  comment,
  depth,
  groupId,
  currentUserId,
  isOwner,
  refreshComments,
  replyCount = 0,
  showReplies = false,
  onToggleReplies
}: Props) {
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [replySecret, setReplySecret] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [nickname, setNickname] = useState(comment.authorNickname || '익명');
  const [profileImage, setProfileImage] = useState(comment.authorProfileImage || null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isCommentOwner = comment.userId === currentUserId;
  const canViewSecret = !comment.flag || isCommentOwner || isOwner;

  useEffect(() => {
    const loadUserInfo = async () => {
      if (!comment.userId) return;
      if (nicknameCache.has(comment.userId)) {
        const cached = nicknameCache.get(comment.userId)!;
        setNickname(cached.nickname);
        if (cached.profileImage) {
          setProfileImage(cached.profileImage);
        }
        return;
      }

      try {
        const res: any = await user.getUserNickname(comment.userId);
        const userInfo =
          typeof res === 'object'
            ? {
                nickname: res.nickname ?? '익명',
                profileImage: res.profileImage || null
              }
            : { nickname: String(res), profileImage: null };

        setNickname(userInfo.nickname);
        if (userInfo.profileImage) {
          setProfileImage(userInfo.profileImage);
        }
        nicknameCache.set(comment.userId, userInfo);
      } catch {}
    };

    if (!comment.authorNickname || !comment.authorProfileImage) loadUserInfo();
  }, [comment.userId, comment.authorNickname, comment.authorProfileImage]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  const handleReply = async () => {
    if (!replyContent.trim()) return;
    await group.createComment(groupId, {
      parentId: comment.commentId,
      content: replyContent,
      flag: replySecret
    });
    await refreshComments();
    setReplyOpen(false);
    setReplyContent('');
    setReplySecret(false);
  };

  const handleUpdate = async () => {
    if (!editContent.trim()) return;
    await group.updateComment(comment.commentId, {
      content: editContent,
      flag: comment.flag
    });
    await refreshComments();
    setEditMode(false);
  };

  const handleDelete = async () => {
    if (!confirm('댓글을 삭제하시겠습니까?')) return;
    await group.deleteComment(comment.commentId);
    await refreshComments();
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';

    try {
      const timestamp = Number(dateString);
      const date = isNaN(timestamp) ? new Date(dateString) : new Date(timestamp);

      if (isNaN(date.getTime())) {
        return dateString;
      }

      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMin = Math.floor(diffMs / 60000);
      const diffHr = Math.floor(diffMs / 3600000);
      const diffDay = Math.floor(diffMs / 86400000);

      if (diffMin < 1) return '방금 전';
      if (diffMin < 60) return `${diffMin}분 전`;
      if (diffHr < 24) return `${diffHr}시간 전`;
      if (diffDay < 7) return `${diffDay}일 전`;

      return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch {
      return dateString;
    }
  };

  const isEdited = comment.updatedAt && comment.updatedAt !== comment.createdAt;
  const displayDate = isEdited ? comment.updatedAt : comment.createdAt;
  const marginLeft = Math.min(depth, 5) * 40;
  console.log('+++', comment.createdAt, displayDate);
  return (
    <div>
      <div
        className={`${styles.container} ${depth > 0 ? styles.reply : ''}`}
        style={{ marginLeft: `${marginLeft}px` }}>
        <div className={styles.header}>
          <div className={styles.authorInfo}>
            <UserProfileImage userId={comment.userId} profileImage={profileImage} size={32} />

            <div className={styles.authorDetails}>
              <div className={styles.authorNameRow}>
                <Link href={`/users/${comment.userId}`} className={styles.author}>
                  {nickname}
                </Link>
                {comment.flag && <Lock size={14} className={styles.lockIcon} />}
              </div>
              <span className={styles.date}>
                {formatDate(displayDate)}
                {isEdited && ' (수정됨)'}
              </span>
            </div>
          </div>

          {isCommentOwner && (
            <div className={styles.menuContainer} ref={menuRef}>
              <button onClick={() => setMenuOpen(!menuOpen)} className={styles.menuButton} aria-label="메뉴">
                <span className={styles.menuIcon}>⋮</span>
              </button>

              {menuOpen && (
                <div className={styles.menuDropdown}>
                  <button
                    onClick={() => {
                      setEditMode(true);
                      setMenuOpen(false);
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

        {editMode ? (
          <div className={styles.editForm}>
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className={styles.textarea}
              rows={3}
            />
            <div className={styles.editActions}>
              <button onClick={handleUpdate} className={styles.saveBtn}>
                저장
              </button>
              <button
                onClick={() => {
                  setEditMode(false);
                  setEditContent(comment.content);
                }}
                className={styles.cancelBtn}>
                취소
              </button>
            </div>
          </div>
        ) : (
          <>
            {canViewSecret ? (
              <p className={styles.content}>{comment.content}</p>
            ) : (
              <p className={styles.secretText}>비밀댓글입니다.</p>
            )}

            <div className={styles.actions}>
              {depth === 0 && (
                <button onClick={() => setReplyOpen(!replyOpen)} className={styles.replyBtn}>
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

        {replyOpen && (
          <div className={styles.replyForm}>
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="답글을 입력하세요"
              className={styles.textarea}
              rows={2}
            />
            <div className={styles.replyActions}>
              <label className={styles.secretLabel}>
                <input
                  type="checkbox"
                  checked={replySecret}
                  onChange={(e) => setReplySecret(e.target.checked)}
                />
                비밀댓글
              </label>
              <button onClick={handleReply} className={styles.submitBtn}>
                답글 작성
              </button>
              <button
                onClick={() => {
                  setReplyOpen(false);
                  setReplyContent('');
                  setReplySecret(false);
                }}
                className={styles.cancelBtn}>
                취소
              </button>
            </div>
          </div>
        )}
      </div>

      {showReplies && comment.replies?.length > 0 && (
        <div className={styles.replyContainer}>
          {comment.replies.map((r: any) => (
            <GroupCommentItem
              key={r.commentId}
              comment={r}
              depth={depth + 1}
              groupId={groupId}
              currentUserId={currentUserId}
              isOwner={isOwner}
              refreshComments={refreshComments}
            />
          ))}
        </div>
      )}
    </div>
  );
}
