'use client';

import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, MessageSquare, PlusCircle, Search, Filter, Bookmark, BookmarkCheck } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';

import styles from './list.module.scss';

import { fetchAladin } from '@/apis/aladin';
import { group as groupApi } from '@/apis/groo/group';
import { user } from '@/apis/groo/user';
import { regionList } from '@/types/common/region';
import { GroupData } from '@/types/groups';

function ReadingGroupList() {
  const router = useRouter();

  const [groups, setGroups] = useState<GroupData[]>([]);
  const [visibleGroups, setVisibleGroups] = useState<GroupData[]>([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('');
  const [styleType, setStyleType] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [mounted, setMounted] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [sort, setSort] = useState<'latest' | 'closed'>('latest');

  // 스크랩 상태 저장 (groupId → boolean)
  const [scrapStatus, setScrapStatus] = useState<Record<number, boolean>>({});

  const filterRef = useRef<HTMLDivElement | null>(null);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const ITEMS_PER_PAGE = 6;

  useEffect(() => {
    setMounted(true);
    loadGroups();
  }, []);

  /** 모임 목록 + 도서 + 지역 + 작성자 닉네임 매핑 */
  const loadGroups = async () => {
    try {
      setLoading(true);
      const response = await groupApi.getAllGroups({ page: 1 });
      const data = response?.groups || [];

      // ISBN 중복 제거 후 도서정보 캐시
      const uniqueISBNs = [...new Set(data.map((g) => g.isbn))];
      const bookInfoMap = new Map();

      await Promise.all(
        uniqueISBNs.map(async (isbn) => {
          if (!isbn) return;
          const res = await fetchAladin.getBookDetails(isbn);
          const item = res?.item?.[0];
          if (item) {
            bookInfoMap.set(isbn, {
              title: item.title,
              author: item.author,
              coverUrl: item.cover
            });
          }
        })
      );

      // 작성자 정보 캐싱 (userId → nickname)
      const uniqueUserIds = [...new Set(data.map((g) => g.userId))];
      const userMap = new Map();

      await Promise.all(
        uniqueUserIds.map(async (id) => {
          try {
            const nickname = await user.getUserNickname(id);
            userMap.set(id, nickname);
          } catch {
            userMap.set(id, id); // fallback: userId
          }
        })
      );

      // region, book, nickname 병합
      const enrichedGroups = data.map((g) => {
        const book = bookInfoMap.get(g.isbn);
        const nickname = userMap.get(g.userId);
        const regionName = regionList.find((r) => r.id === Number(g.codeId))?.name || '지역 미정';

        return {
          ...g,
          bookTitle: book?.title || g.bookTitle || '제목 없음',
          author: book?.author || '저자 미상',
          coverUrl: book?.coverUrl || `https://covers.openlibrary.org/b/isbn/${g.isbn}-M.jpg`,
          region: regionName,
          nickname
        };
      });

      // 스크랩 상태 병렬로 가져오기
      const scrapMap: Record<number, boolean> = {};
      await Promise.all(
        enrichedGroups.map(async (g) => {
          try {
            const res = await groupApi.getScrapStatus(g.groupId);

            scrapMap[g.groupId] = res.data ?? false;
          } catch (err) {
            scrapMap[g.groupId] = false;
          }
        })
      );

      setScrapStatus(scrapMap);

      setGroups(enrichedGroups);
      setVisibleGroups(enrichedGroups.slice(0, ITEMS_PER_PAGE));
      setPage(1);
    } catch (err: any) {
      setError('모임 목록을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  /** 스크랩 토글 */
  const toggleScrap = async (groupId: number) => {
    try {
      const current = scrapStatus[groupId];
      if (current) {
        await groupApi.deleteScrap(groupId);
      } else {
        await groupApi.createScrap(groupId);
      }
      setScrapStatus((prev) => ({ ...prev, [groupId]: !current }));
    } catch (err) {}
  };

  const applyFilter = (list: GroupData[]) => {
    let filtered = list.filter((g) => {
      const matchSearch =
        (g.groupName ?? '').toLowerCase().includes(search.toLowerCase()) ||
        (g.bookTitle ?? '').toLowerCase().includes(search.toLowerCase());

      // name 기준으로 region id 찾아서 숫자 변환 후 비교
      const regionId = regionList.find((r) => r.name === region)?.id;
      const matchRegion = !region || (regionId && Number(g.codeId) === Number(regionId));

      const matchStyle = !styleType || g.style === styleType;
      const matchDate = !date || (g.endDate && new Date(g.endDate).toISOString().slice(0, 10) === date);

      return matchSearch && matchRegion && matchStyle && matchDate;
    });

    if (sort === 'closed') filtered = filtered.filter((g) => !g.status);
    return filtered;
  };

  // 필터 팝업 외부 클릭 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setShowFilter(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowFilter(false);
    };
    if (showFilter) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEsc);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [showFilter]);

  if (!mounted || loading) return <div className={styles.state}>불러오는 중...</div>;
  if (error)
    return (
      <div className={styles.state}>
        <p>{error}</p>
        <button onClick={loadGroups}>다시 시도</button>
      </div>
    );

  const filteredGroups = applyFilter(visibleGroups);

  return (
    <section className={styles.container}>
      {/* 검색창 */}
      <div className={styles.searchBox}>
        <div className={styles.searchWrapper}>
          <input
            type="text"
            placeholder="지금 바로 독서 모임에 참여해보세요!"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />
          <Search size={18} className={styles.searchIcon} />
        </div>
      </div>

      {/* 상단 헤더 */}
      <header className={styles.header}>
        <div className={styles.sortButtons}>
          <button className={clsx({ [styles.active]: sort === 'latest' })} onClick={() => setSort('latest')}>
            최신순
          </button>
          <button className={clsx({ [styles.active]: sort === 'closed' })} onClick={() => setSort('closed')}>
            모집완료
          </button>
        </div>

        <div className={styles.rightArea}>
          <div className={styles.filterWrapper} ref={filterRef}>
            <button className={styles.filterButton} onClick={() => setShowFilter((p) => !p)}>
              <Filter size={18} />
              <span>필터</span>
            </button>

            <AnimatePresence>
              {showFilter && (
                <motion.div
                  className={styles.filterPopup}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}>
                  <div className={styles.filterRow}>
                    <select
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      className={styles.select}>
                      <option value="">지역 전체</option>
                      {regionList.map((r) => (
                        <option key={r.code} value={r.name}>
                          {r.name}
                        </option>
                      ))}
                    </select>

                    <select
                      value={styleType}
                      onChange={(e) => setStyleType(e.target.value)}
                      className={styles.select}>
                      <option value="">형식 전체</option>
                      <option value="독서">독서</option>
                      <option value="토론">토론</option>
                      <option value="자유">자유</option>
                    </select>
                  </div>

                  <div className={styles.filterRow}>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className={styles.dateInput}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button className={styles.writeButton} onClick={() => router.push('/groups/write')}>
            <PlusCircle size={18} />
            <span>모임 만들기</span>
          </button>
        </div>
      </header>

      {/* 리스트 */}
      <ul className={styles.list}>
        {filteredGroups.map((g) => (
          <motion.li
            key={g.groupId}
            className={styles.card}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}>
            <Link href={`/groups/${g.groupId}`} className={styles.thumb}>
              <img
                src={g.coverUrl || `https://covers.openlibrary.org/b/isbn/${g.isbn}-M.jpg`}
                alt={g.bookTitle || '책 표지'}
              />
            </Link>

            <div className={styles.cardBody}>
              {/* 제목 + 북마크 */}
              <div className={styles.titleRow}>
                <h3 className={styles.title}>{g.bookTitle}</h3>
                <button
                  className={clsx(styles.scrapButton, {
                    [styles.active]: scrapStatus[g.groupId]
                  })}
                  onClick={() => toggleScrap(g.groupId)}
                  aria-label="스크랩 토글">
                  {scrapStatus[g.groupId] ? (
                    <BookmarkCheck size={20} color="#00796b" fill="#00796b" />
                  ) : (
                    <Bookmark size={20} color="#555" />
                  )}
                </button>
              </div>

              <p className={styles.author}>{g.author || '저자 미상'}</p>
              <p className={styles.content}>{g.content}</p>

              {/* 하단 정보라인 */}
              <div className={styles.meta}>
                <span>{g.style}</span> |
                <span>
                  {g.headcountMin}-{g.headcountMax}명
                </span>{' '}
                |<span>{g.region}</span> |<span>{new Date(g.endDate).toLocaleDateString()}</span> |
                <span className={`${styles.badge} ${g.status ? styles.active : styles.closed}`}>
                  {g.status ? '모집중' : '모집완료'}
                </span>
                |
                <Link href={`/users/${g.userId}`} className={styles.nickname}>
                  {g.nickname}
                </Link>
              </div>
            </div>
          </motion.li>
        ))}
      </ul>

      <div ref={loaderRef} style={{ height: '60px' }} />
    </section>
  );
}

export default ReadingGroupList;
