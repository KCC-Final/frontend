'use client';

import { Bookmark, BookmarkCheck, ArrowLeft, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

import styles from './group-detail.module.scss';

import { group } from '@/apis/groo/group';
import { user } from '@/apis/groo/user';

// 닉네임 캐시 (중복 요청 방지)
const nicknameCache = new Map<string, string>();

interface Props {
  groupData: any;
  isScrapped: boolean;
  toggleScrap: () => void;
  isOwner: boolean;
  router: any;
}

function GroupDetailHeader({ groupData, isScrapped, toggleScrap, isOwner, router }: Props) {
  const [nickname, setNickname] = useState(groupData.nickname || '');
  const userId = groupData.userId;

  /** 닉네임 가져오기 */
  useEffect(() => {
    const loadNickname = async () => {
      if (!userId) return;

      // 이미 캐시된 닉네임이 있으면 즉시 사용
      if (nicknameCache.has(userId)) {
        setNickname(nicknameCache.get(userId)!);
        return;
      }

      try {
        const res: any = await user.getUserNickname(userId);
        const fetchedNickname = typeof res === 'object' ? (res.nickname ?? userId) : String(res);
        setNickname(fetchedNickname);
        nicknameCache.set(userId, fetchedNickname);
      } catch (error) {
        setNickname(userId); // fallback
      }
    };

    if (!groupData.nickname) loadNickname();
  }, [userId, groupData.nickname]);

  return (
    <header className={styles.header}>
      {/* 모집 상태 뱃지 */}
      <div className={styles.badgeWrapper}>
        <span className={`${styles.badge} ${groupData.status ? styles.active : styles.closed}`}>
          {groupData.status ? '모집 중' : '모집완료'}
        </span>
      </div>

      {/* 제목 + 북마크 + 작성자 */}
      <div className={styles.titleRow}>
        <div className={styles.titleGroup}>
          <h1 className={styles.title}>{groupData.groupName}</h1>

          {/* 제목 옆 북마크 + 작성자 */}
          <div className={styles.metaInline}>
            <button
              className={`${styles.scrapButton} ${isScrapped ? styles.activeScrap : ''}`}
              onClick={toggleScrap}>
              {isScrapped ? (
                <BookmarkCheck size={20} fill="#1f8b4c" color="#1f8b4c" />
              ) : (
                <Bookmark size={20} color="#444" />
              )}
            </button>

            {/* 닉네임 표시 */}
            <span className={styles.authorText}>
              작성자 |{' '}
              <Link href={`/users/${userId}`} className={styles.nicknameLink}>
                {nickname || userId}
              </Link>
            </span>
          </div>
        </div>

        {/* 뒤로가기 버튼 */}
        <button type="button" className={styles.backBtn} onClick={() => router.back()}>
          <ArrowLeft size={18} />
          뒤로가기
        </button>
      </div>

      {/* 수정/삭제 버튼 */}
      {isOwner && (
        <div className={styles.actionButtons}>
          <button className={styles.editBtn} onClick={() => router.push(`/groups/${groupData.groupId}/edit`)}>
            <Edit size={16} /> 수정
          </button>
          <button
            className={styles.deleteBtn}
            onClick={async () => {
              if (confirm('정말로 이 모임을 삭제하시겠습니까?')) {
                try {
                  const res = await group.deleteGroup(groupData.groupId);
                  if (res.message?.includes('성공')) {
                    alert('모임이 삭제되었습니다.');
                    router.push('/groups');
                  } else alert('삭제 실패');
                } catch {
                  alert('삭제 중 오류 발생');
                }
              }
            }}>
            <Trash2 size={16} /> 삭제
          </button>
        </div>
      )}
    </header>
  );
}

export default GroupDetailHeader;
