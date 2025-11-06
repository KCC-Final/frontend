'use client';

import { Lock } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

import styles from './group-detail.module.scss';

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

// 닉네임/프로필 캐시 (중복 요청 방지)
const nicknameCache = new Map<string, { nickname: string; profileImage?: string }>();

function GroupCommentItem({ comment, depth, groupId, currentUserId, isOwner, refreshComments }: Props) {
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [replySecret, setReplySecret] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [editSecret, setEditSecret] = useState(comment.flag);

  const [nickname, setNickname] = useState(comment.authorNickname || '익명');
  const [profileImage, setProfileImage] = useState(comment.authorProfileImage || '/default-profile.png');

  const isCommentOwner = comment.userId === currentUserId;
  const canViewSecret = !comment.flag || isCommentOwner || isOwner;

  /** 닉네임/프로필 가져오기 */
  useEffect(() => {
    const loadUserInfo = async () => {
      if (!comment.userId) return;

      // 이미 캐시되어 있으면 즉시 적용
      if (nicknameCache.has(comment.userId)) {
        const cached = nicknameCache.get(comment.userId)!;
        setNickname(cached.nickname);
        if (cached.profileImage) setProfileImage(cached.profileImage);
        return;
      }

      try {
        const res: any = await user.getUserNickname(comment.userId);

        // 응답이 객체인지 문자열인지 분기
        const userInfo =
          typeof res === 'object'
            ? {
                nickname: res.nickname ?? '익명',
                profileImage: res.profileImage ?? '/default-profile.png'
              }
            : { nickname: String(res), profileImage: '/default-profile.png' };

        setNickname(userInfo.nickname);
        setProfileImage(userInfo.profileImage);
        nicknameCache.set(comment.userId, userInfo);
      } catch (error) {}
    };

    // 서버에서 닉네임이 내려오지 않았을 때만 요청
    if (!comment.authorNickname || !comment.authorProfileImage) {
      loadUserInfo();
    }
  }, [comment.userId, comment.authorNickname, comment.authorProfileImage]);

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
    await group.updateComment(comment.commentId, {
      content: editContent,
      flag: editSecret
    });
    await refreshComments();
    setEditMode(false);
  };

  const handleDelete = async () => {
    const confirmed = window.confirm('댓글을 삭제하시겠습니까?');
    if (!confirmed) return;

    try {
      await group.deleteComment(comment.commentId);
      alert('댓글이 삭제되었습니다.');
      await refreshComments();
    } catch (error) {
      alert('댓글 삭제에 실패했습니다.');
    }
  };

  return (
    <li className={styles.commentItem} data-depth={depth}>
      {/* 헤더 */}
      <div className={styles.commentHeader}>
        <div className={styles.leftArea}>
          {/* 프로필 이미지 처리 */}
          <UserProfileImage userId={comment.userId} profileImage={comment.authorProfileImage} size={36} />

          {/* 닉네임 + 자물쇠 */}
          <span className={styles.commentAuthor}>
            <Link href={`/users/${comment.userId}`} className={styles.nicknameLink}>
              {nickname}
            </Link>
            {comment.flag && <Lock size={14} className={styles.lockIcon} />}
          </span>
        </div>
        {/* 날짜 + 답댓글 버튼 */}
        <div className={styles.rightArea}>
          {' '}
          <span className={styles.commentDate}>
            {' '}
            {new Date(comment.createdAt).toLocaleDateString('ko-KR')}{' '}
          </span>{' '}
          {depth === 0 && (
            <div className={styles.replyButtonWrapper}>
              {' '}
              <button className={styles.replyButton} onClick={() => setReplyOpen(!replyOpen)}>
                {' '}
                답댓글{' '}
              </button>{' '}
            </div>
          )}{' '}
        </div>{' '}
      </div>

      {/* 본문 */}
      <div className={styles.commentBody}>
        {editMode ? (
          <div className={styles.editBox}>
            <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} />
            <div className={styles.commentOptions}>
              <label>
                <input
                  type="checkbox"
                  checked={editSecret}
                  onChange={(e) => setEditSecret(e.target.checked)}
                />
                비밀댓글
              </label>
              <div className={styles.editActions}>
                <button onClick={handleUpdate}>저장</button>
                <button onClick={() => setEditMode(false)}>취소</button>
              </div>
            </div>
          </div>
        ) : canViewSecret ? (
          <p className={styles.commentContent}>{comment.content}</p>
        ) : (
          <em className={styles.secretText}>
            <span>비밀댓글입니다.</span>
          </em>
        )}
      </div>

      {/* 하단 액션 */}
      <div className={styles.commentActions}>
        {isCommentOwner && (
          <>
            <button onClick={handleDelete}>삭제</button>
            <button onClick={() => setEditMode(true)}>수정</button>
          </>
        )}
      </div>

      {/* 답댓글 입력창 */}
      {replyOpen && (
        <div className={styles.replyBox}>
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="답글을 입력하세요..."
          />
          <div className={styles.commentOptions}>
            <label>
              <input
                type="checkbox"
                checked={replySecret}
                onChange={(e) => setReplySecret(e.target.checked)}
              />
              비밀댓글
            </label>
            <button onClick={handleReply}>등록</button>
          </div>
        </div>
      )}

      {/* 대댓글 */}
      {comment.replies?.length > 0 && (
        <ul className={styles.commentList}>
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
        </ul>
      )}
    </li>
  );
}

export default GroupCommentItem;
