'use client';

import { Lock } from 'lucide-react';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';

import styles from './group-comment.module.scss';

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
}

const nicknameCache = new Map<string, { nickname: string; profileImage?: string }>();

export default function GroupCommentItem({
  comment,
  depth,
  groupId,
  currentUserId,
  isOwner,
  refreshComments
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

  /** 닉네임/프로필 캐싱 */
  useEffect(() => {
    const loadUserInfo = async () => {
      if (!comment.userId) return;
      if (nicknameCache.has(comment.userId)) {
        const cached = nicknameCache.get(comment.userId)!;
        setNickname(cached.nickname);
        // 캐시에 profileImage가 있고 유효한 값일 때만 설정
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
        // profileImage가 유효한 값일 때만 state 업데이트
        if (userInfo.profileImage) {
          setProfileImage(userInfo.profileImage);
        }
        nicknameCache.set(comment.userId, userInfo);
      } catch {}
    };

    if (!comment.authorNickname || !comment.authorProfileImage) loadUserInfo();
  }, [comment.userId, comment.authorNickname, comment.authorProfileImage]);

  /** 외부 클릭시 메뉴 닫기 */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  /** CRUD */
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
    try {
      const date = new Date(dateString);
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

  const displayDate = comment.updatedAt || comment.createdAt;
  const marginLeft = Math.min(depth, 5) * 40;

  return (
    <div
      className={`${styles.commentContainer} ${depth > 0 ? styles.reply : ''}`}
      style={{ marginLeft: `${marginLeft}px` }}>
      {/* 헤더 */}
      <div className={styles.commentHeader}>
        <div className={styles.commentUser}>
          <UserProfileImage userId={comment.userId} profileImage={profileImage} size={36} />

          <div className={styles.userMeta}>
            <Link href={`/users/${comment.userId}`} className={styles.userName}>
              {nickname}
            </Link>
            <span className={styles.commentDate}>{formatDate(displayDate)}</span>
          </div>
          {comment.flag && <Lock size={14} className={styles.lockIcon} />}
        </div>

        {isCommentOwner && (
          <div className={styles.menuWrapper} ref={menuRef}>
            <button onClick={() => setMenuOpen(!menuOpen)} className={styles.menuButton}>
              ⋮
            </button>
            {menuOpen && (
              <div className={styles.menuDropdown}>
                <button onClick={() => setEditMode(true)}>수정</button>
                <button onClick={handleDelete}>삭제</button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 본문 */}
      <div className={styles.commentBody}>
        {editMode ? (
          <div className={styles.editForm}>
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={3}
              className={styles.textarea}
            />
            <div className={styles.editActions}>
              <button onClick={handleUpdate}>저장</button>
              <button onClick={() => setEditMode(false)}>취소</button>
            </div>
          </div>
        ) : canViewSecret ? (
          <p className={styles.commentText}>{comment.content}</p>
        ) : (
          <em className={styles.secretText}>비밀댓글입니다.</em>
        )}
      </div>

      {/* 하단 액션 */}
      <div className={styles.commentFooter}>
        {depth === 0 && (
          <button className={styles.replyBtn} onClick={() => setReplyOpen(!replyOpen)}>
            답글
          </button>
        )}
      </div>

      {/* 답글 입력 */}
      {replyOpen && (
        <div className={styles.replyForm}>
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="답글을 입력하세요"
            rows={2}
            className={styles.textarea}
          />
          <div className={styles.replyActions}>
            <label>
              <input
                type="checkbox"
                checked={replySecret}
                onChange={(e) => setReplySecret(e.target.checked)}
              />{' '}
              비밀댓글
            </label>
            <button onClick={handleReply}>등록</button>
          </div>
        </div>
      )}

      {/* 대댓글 */}
      {comment.replies?.length > 0 && (
        <div className={styles.replyList}>
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
