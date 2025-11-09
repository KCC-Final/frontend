'use client';

import { format } from 'date-fns';
import { MoreVertical, Bookmark } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';

import styles from './GroupDetailHeader.module.scss';

import { group } from '@/apis/groo/group';
import { user } from '@/apis/groo/user';
import UserProfileImage from '@/components/common/profile/image';
import { formatRelativeTime } from '@/utils/format/date';

interface Props {
  groupData: any;
  isOwner: boolean;
  currentUserId: string | null;
  router: any;
  refreshGroup: () => Promise<void>;
  isScrapped: boolean;
  onToggleScrap: () => void;
}

export default function GroupDetailHeader({
  groupData,
  isOwner,
  currentUserId,
  router,
  refreshGroup,
  isScrapped,
  onToggleScrap
}: Props) {
  const [nickname, setNickname] = useState(groupData.nickname || '');
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const userId = groupData.userId;

  useEffect(() => {
    const fetchNickname = async () => {
      try {
        const res: any = await user.getUserNickname(userId);
        setNickname(typeof res === 'object' ? (res.nickname ?? userId) : String(res));
      } catch {
        setNickname(userId);
      }
    };
    if (!groupData.nickname) fetchNickname();
  }, [groupData.nickname, userId]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    if (showMenu) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  const handleEdit = () => {
    setShowMenu(false);
    router.push(`/groups/${groupData.groupId}/edit`);
  };
  const handleDelete = async () => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    try {
      await group.deleteGroup(groupData.groupId);
      alert('삭제되었습니다.');
      router.push('/groups');
    } catch {
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';

    try {
      // 타임스탬프(숫자)인 경우 처리
      const timestamp = Number(dateString);
      const date = isNaN(timestamp) ? new Date(dateString) : new Date(timestamp);

      // Invalid Date 체크
      if (isNaN(date.getTime())) {
        return dateString;
      }

      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <header className={styles.detailHeader}>
      {/* 제목 섹션 */}
      <div className={styles.titleSection}>
        <h1 className={styles.groupTitle}>{groupData.groupName}</h1>
        <div className={styles.titleActions}>
          <span className={`${styles.statusBadge} ${groupData.status ? styles.recruiting : styles.closed}`}>
            {groupData.status ? '모집중' : '모집완료'}
          </span>
          <button
            className={`${styles.scrapButton} ${isScrapped ? styles.scrapped : ''}`}
            onClick={onToggleScrap}
            aria-label={isScrapped ? '스크랩 취소' : '스크랩'}>
            <Bookmark size={20} fill={isScrapped ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>

      {/* 작성자 섹션 */}
      <div className={styles.authorSection}>
        <div className={styles.authorInfo}>
          <UserProfileImage userId={groupData.userId} profileImage={groupData.authorProfileImage} size={40} />
          <div className={styles.authorDetails}>
            <Link href={`/users/${groupData.userId}`} className={styles.authorName}>
              {nickname || userId}
            </Link>
            <p className={styles.date}>{formatRelativeTime(groupData.createdAt)}</p>
          </div>
        </div>

        {isOwner && (
          <div className={styles.menuContainer} ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className={styles.menuButton}
              aria-label="메뉴 열기">
              <MoreVertical size={18} />
            </button>

            {showMenu && (
              <div className={styles.menuDropdown}>
                <button onClick={handleEdit}>수정</button>
                <button onClick={handleDelete}>삭제</button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 모임 메타 정보 */}
      <div className={styles.metaInfo}>
        <div className={styles.metaList}>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>진행 방식:</span>
            <span className={styles.metaValue}>{groupData.style}</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>모집 인원:</span>
            <span className={styles.metaValue}>
              {groupData.headcountMin}~{groupData.headcountMax}명
            </span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>모집 지역:</span>
            <span className={styles.metaValue}>{groupData.region}</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>마감 일자:</span>
            <span className={styles.metaValue}>{format(new Date(groupData.endDate), 'yyyy-MM-dd')}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
