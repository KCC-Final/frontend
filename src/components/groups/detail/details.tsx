'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

import styles from './group-detail.module.scss';
import GroupCommentSection from './GroupCommentSection';
import GroupDetailHeader from './GroupDetailHeader';

import { fetchAladin } from '@/apis';
import { group } from '@/apis/groo/group';
import { user } from '@/apis/groo/user';
import BookInfo from '@/components/reviews/detail/BookInfo';
import { regionList } from '@/types/common/region';
import { GroupData, GroupCommentData } from '@/types/groups';
import { AladinBook } from '@/types/reviews/book-search';

/** 본문 구역 추출 유틸 */
interface GroupSections {
  intro: string;
  keywords: string;
  howto: string;
}

const parseGroupContent = (content: string): GroupSections => {
  if (!content) return { intro: '', keywords: '', howto: '' };

  const introMatch = content.match(/모임\s*소개([\s\S]*?)(?=토론\s*키워드|참여\s*방법|$)/);
  const keywordMatch = content.match(/토론\s*키워드([\s\S]*?)(?=참여\s*방법|$)/);
  const howtoMatch = content.match(/참여\s*방법([\s\S]*)/);

  return {
    intro: introMatch ? introMatch[1].trim() : '',
    keywords: keywordMatch ? keywordMatch[1].trim() : '',
    howto: howtoMatch ? howtoMatch[1].trim() : ''
  };
};

function ReadingGroupDetail() {
  const { id } = useParams();
  const router = useRouter();

  const [groupData, setGroupData] = useState<GroupData | null>(null);
  const [bookInfo, setBookInfo] = useState<AladinBook | null>(null);
  const [loadingBook, setLoadingBook] = useState(true);
  const [comments, setComments] = useState<GroupCommentData[]>([]);
  const [isScrapped, setIsScrapped] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const res = await user.getMyInfo();
        const myId = res.data.userId;
        if (myId) {
          localStorage.setItem('userId', myId);
          setCurrentUserId(myId);
        }
      } catch (e) {
        console.error('현재 사용자 정보 조회 실패:', e);
      }
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const detail = await group.getGroupDetail(Number(id));
        const regionName =
          regionList.find((r) => r.code === String(detail.group.codeId))?.name || '지역 미정';

        setGroupData({ ...detail.group, region: regionName });
        setComments(detail.comments);

        const scrapRes = await group.getScrapStatus(Number(id));
        setIsScrapped(scrapRes.data ?? false);

        if (detail.group.isbn) {
          const response = await fetchAladin.getBookDetails(detail.group.isbn);
          if (response.item?.length > 0) setBookInfo(response.item[0]);
        }

        if (currentUserId) {
          setIsOwner(String(detail.group.userId) === String(currentUserId));
        }
      } catch (error) {
        console.error('상세 페이지 로드 실패:', error);
      } finally {
        setLoadingBook(false);
      }
    };
    if (currentUserId) loadData();
  }, [id, currentUserId]);

  if (!groupData) return <div className={styles.loading}>로딩 중...</div>;

  const sections = parseGroupContent(groupData.content);

  const refreshComments = async () => {
    const updated = await group.getCommentsByGroupId(groupData.groupId);
    setComments(updated);
  };

  const toggleScrap = async () => {
    if (!groupData) return;
    try {
      if (isScrapped) {
        await group.deleteScrap(groupData.groupId);
        setIsScrapped(false);
      } else {
        const res = await group.createScrap(groupData.groupId);
        setIsScrapped(res.data ?? true);
      }
    } catch (e) {
      console.error('스크랩 토글 실패:', e);
    }
  };

  return (
    <section className={styles.container}>
      {/* 상단 헤더 */}
      <GroupDetailHeader
        groupData={groupData}
        isScrapped={isScrapped}
        toggleScrap={toggleScrap}
        isOwner={isOwner}
        router={router}
      />

      {/* 도서 정보 */}
      {groupData.isbn && <BookInfo bookInfo={bookInfo} loading={loadingBook} />}

      {/* 본문 (모임 소개 / 토론 키워드 / 참여 방법) */}
      <article className={styles.bodySection}>
        <div className={styles.subSection}>
          <h3>모임 소개</h3>
          <p className={styles.paragraph}>{sections.intro || '내용이 없습니다.'}</p>
        </div>

        <div className={styles.subSection}>
          <h3>토론 키워드</h3>
          <p className={styles.paragraph}>{sections.keywords || '등록된 키워드가 없습니다.'}</p>
        </div>

        <div className={styles.subSection}>
          <h3>참여 방법</h3>
          <p className={styles.paragraph}>{sections.howto || '등록된 안내가 없습니다.'}</p>
        </div>
      </article>

      {/* 댓글 섹션 */}
      <GroupCommentSection
        comments={comments}
        groupId={groupData.groupId}
        isOwner={isOwner}
        currentUserId={currentUserId}
        refreshComments={refreshComments}
      />
    </section>
  );
}

export default ReadingGroupDetail;
