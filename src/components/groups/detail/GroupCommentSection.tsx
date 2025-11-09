'use client';

import { useState } from 'react';

import GroupCommentItem from './GroupCommentItem';
import styles from './GroupCommentSection.module.scss';

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
  const [expandedComments, setExpandedComments] = useState<Set<number>>(new Set());

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;
    try {
      await group.createComment(groupId, { content: newComment, flag: isSecret });
      await refreshComments();
      setNewComment('');
      setIsSecret(false);
    } catch (e) {}
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

  const getReplyCount = (commentId: number): number => {
    const comment = comments.find((c) => c.commentId === commentId);
    if (!comment) return 0;

    const directReplies = comments.filter((c) => c.parentId === commentId);
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

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>댓글</h2>
        <span className={styles.count}>{comments.length}</span>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleCommentSubmit();
        }}
        className={styles.commentForm}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="댓글을 입력하세요"
          className={styles.textarea}
          rows={3}
        />
        <div className={styles.formActions}>
          <label className={styles.secretLabel}>
            <input type="checkbox" checked={isSecret} onChange={(e) => setIsSecret(e.target.checked)} />
            비밀댓글
          </label>
          <button type="submit" className={styles.submitBtn} disabled={!newComment.trim()}>
            댓글 작성
          </button>
        </div>
      </form>

      <div className={styles.commentList}>
        {comments.length === 0 ? (
          <div className={styles.empty}>첫 번째 댓글을 작성해보세요.</div>
        ) : (
          buildTree(comments).map((c) => (
            <GroupCommentItem
              key={c.commentId}
              comment={c}
              depth={0}
              groupId={groupId}
              currentUserId={currentUserId}
              isOwner={isOwner}
              refreshComments={refreshComments}
              replyCount={getReplyCount(c.commentId)}
              showReplies={expandedComments.has(c.commentId)}
              onToggleReplies={() => toggleReplies(c.commentId)}
            />
          ))
        )}
      </div>
    </section>
  );
}

export default GroupCommentSection;
