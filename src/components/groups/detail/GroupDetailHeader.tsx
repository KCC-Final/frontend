'use client';

import { MoreVertical } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';

import styles from './group-detail.module.scss';

import { group } from '@/apis/groo/group';
import { user } from '@/apis/groo/user';
import UserProfileImage from '@/components/common/profile/image';

interface Props {
  groupData: any;
  isOwner: boolean;
  currentUserId: string | null;
  router: any;
  refreshGroup: () => Promise<void>;
}

export default function GroupDetailHeader({
  groupData,
  isOwner,
  currentUserId,
  router,
  refreshGroup
}: Props) {
  const [nickname, setNickname] = useState(groupData.nickname || '');
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const userId = groupData.userId;

  /** 닉네임 가져오기 */
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

  /** 외부 클릭 시 메뉴 닫기 */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    if (showMenu) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  /** 수정 / 삭제 */
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

  /** 날짜 포맷 */
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('ko-KR', {
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
      </div>

      {/* 작성자 섹션 */}
      <div className={styles.authorSection}>
        <div className={styles.authorInfo}>
          <UserProfileImage userId={groupData.userId} profileImage={groupData.authorProfileImage} size={40} />
          <div className={styles.authorDetails}>
            <Link href={`/users/${groupData.userId}`} className={styles.authorName}>
              {nickname || userId}
            </Link>
            <p className={styles.date}>{formatDate(groupData.createdAt)}</p>
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
    </header>
  );
}
