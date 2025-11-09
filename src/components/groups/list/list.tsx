'use client';

import clsx from 'clsx';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, Search, Filter } from 'lucide-react';
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

  // 사용하지 않던 groups, page 제거
  const [visibleGroups, setVisibleGroups] = useState<GroupData[]>([]);
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('');
  const [styleType, setStyleType] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [mounted, setMounted] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [sort, setSort] = useState<'all' | 'recruiting'>('all');

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
            userMap.set(id, id); // fallback
          }
        })
      );

      const enrichedGroups = data.map((g) => {
        const book = bookInfoMap.get(g.isbn);
        const nickname = userMap.get(g.userId);
        const regionName = regionList.find((r) => r.id === Number(g.codeId))?.name || '지역 미정';

        return {
          ...g,
          bookTitle: book?.title || g.bookTitle || '제목 없음',
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
          } catch {
            scrapMap[g.groupId] = false;
          }
        })
      );

      setScrapStatus(scrapMap);
      setVisibleGroups(enrichedGroups.slice(0, ITEMS_PER_PAGE));
    } catch {
      setError('모임 목록을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  /** 스크랩 토글 */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const toggleScrap = async (groupId: number) => {
    try {
      const current = scrapStatus[groupId];
      if (current) await groupApi.deleteScrap(groupId);
      else await groupApi.createScrap(groupId);
      setScrapStatus((prev) => ({ ...prev, [groupId]: !current }));
    } catch {}
  };

  /** 필터 초기화 */
  const resetFilters = () => {
    setSearch('');
    setRegion('');
    setStyleType('');
    setDate('');
  };

  const applyFilter = (list: GroupData[]) => {
    let filtered = list.filter((g) => {
      const matchSearch =
        (g.groupName ?? '').toLowerCase().includes(search.toLowerCase()) ||
        (g.bookTitle ?? '').toLowerCase().includes(search.toLowerCase());
      const regionId = regionList.find((r) => r.name === region)?.id;
      const matchRegion = !region || (regionId && Number(g.codeId) === Number(regionId));
      const matchStyle = !styleType || g.style === styleType;

      let matchDate = true;
      if (date && g.endDate) {
        const d = new Date(g.endDate);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const endDateStr = `${year}-${month}-${day}`;
        matchDate = endDateStr === date;
      }

      return matchSearch && matchRegion && matchStyle && matchDate;
    });

    if (sort === 'recruiting') filtered = filtered.filter((g) => g.status);
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
          <button className={clsx({ [styles.active]: sort === 'all' })} onClick={() => setSort('all')}>
            전체
          </button>
          <button
            className={clsx({ [styles.active]: sort === 'recruiting' })}
            onClick={() => setSort('recruiting')}>
            모집중
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
                  <div className={styles.filterHeader}>
                    <span className={styles.filterTitle}>필터</span>
                    <button className={styles.resetButton} onClick={resetFilters}>
                      초기화
                    </button>
                  </div>

                  {/* label과 input/select 연결 - 접근성 오류 수정 */}
                  <div className={styles.filterSection}>
                    <label htmlFor="region" className={styles.filterLabel}>
                      지역
                    </label>
                    <select
                      id="region"
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      className={styles.select}>
                      <option value="">전체</option>
                      {regionList.map((r) => (
                        <option key={r.code} value={r.name}>
                          {r.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.filterSection}>
                    <label htmlFor="styleType" className={styles.filterLabel}>
                      진행 방식
                    </label>
                    <select
                      id="styleType"
                      value={styleType}
                      onChange={(e) => setStyleType(e.target.value)}
                      className={styles.select}>
                      <option value="">전체</option>
                      <option value="독서">독서</option>
                      <option value="토론">토론</option>
                      <option value="자유">자유</option>
                    </select>
                  </div>

                  <div className={styles.filterSection}>
                    <label htmlFor="date" className={styles.filterLabel}>
                      모집 마감 날짜
                    </label>
                    <input
                      id="date"
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
            transition={{ duration: 0.25 }}
            onClick={(e) => {
              const target = e.target as HTMLElement;
              if (target.closest('button') || target.closest('a')) return;
              router.push(`/groups/${g.groupId}`);
            }}
            role="button"
            tabIndex={0}>
            <div className={styles.cardContent}>
              {/* 왼쪽 정보 영역 */}
              <div className={styles.infoArea}>
                <div className={styles.titleRow}>
                  <h3 className={styles.title}>{g.groupName}</h3>
                  <span className={`${styles.badge} ${g.status ? styles.active : styles.closed}`}>
                    {g.status ? '모집중' : '모집완료'}
                  </span>
                </div>

                <div className={styles.metaInfo}>
                  <span>진행 방식: {g.style}</span>
                  <span>
                    모집 인원: {g.headcountMin}~{g.headcountMax}명
                  </span>
                  <span>지역: {g.region}</span>
                  <span className={styles.metaValue}>
                    마감일: {format(new Date(g.endDate), 'yyyy-MM-dd')}
                  </span>
                </div>
              </div>

              {/* 오른쪽 도서 이미지 */}
              {g.coverUrl && (
                <div className={styles.imageArea}>
                  <img src={g.coverUrl} alt={g.bookTitle} />
                </div>
              )}
            </div>
          </motion.li>
        ))}
      </ul>

      <div ref={loaderRef} style={{ height: '60px' }} />
    </section>
  );
}

export default ReadingGroupList;
