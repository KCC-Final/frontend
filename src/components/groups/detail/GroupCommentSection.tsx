'use client';

import { useState } from 'react';

import styles from './group-detail.module.scss';
import GroupCommentItem from './GroupCommentItem';

import { group } from '@/apis/groo/group';
import { GroupCommentData } from '@/types/groups';

interface Props {
  comments: GroupCommentData[];
  groupId: number;
  isOwner: boolean;
  currentUserId: string | null;
  refreshComments: () => Promise<void>;
}

function GroupCommentSection({ comments, groupId, isOwner, currentUserId, refreshComments }: Props) {
  const [newComment, setNewComment] = useState('');
  const [isSecret, setIsSecret] = useState(false);

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;
    try {
      await group.createComment(groupId, { content: newComment, flag: isSecret });
      await refreshComments();
      setNewComment('');
      setIsSecret(false);
    } catch (e) {
      console.error('댓글 등록 실패:', e);
    }
  };

  const buildTree = (list: GroupCommentData[]) => {
    const map: Record<number, any> = {};
    const roots: any[] = [];
    list.forEach((c) => (map[c.commentId] = { ...c, replies: [] }));
    list.forEach((c) =>
      c.parentId ? map[c.parentId]?.replies.push(map[c.commentId]) : roots.push(map[c.commentId])
    );
    return roots;
  };

  return (
    <section className={styles.commentSection}>
      <h3>댓글 {comments.length}</h3>

      <div className={styles.commentInput}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="댓글을 입력하세요"
        />
        <div className={styles.commentOptions}>
          <label>
            <input type="checkbox" checked={isSecret} onChange={(e) => setIsSecret(e.target.checked)} />
            비밀댓글
          </label>
          <button onClick={handleCommentSubmit}>댓글 작성</button>
        </div>
      </div>

      <ul className={styles.commentList}>
        {buildTree(comments).map((c) => (
          <GroupCommentItem
            key={c.commentId}
            comment={c}
            depth={0}
            groupId={groupId}
            currentUserId={currentUserId}
            isOwner={isOwner}
            refreshComments={refreshComments}
          />
        ))}
      </ul>
    </section>
  );
}

export default GroupCommentSection;
