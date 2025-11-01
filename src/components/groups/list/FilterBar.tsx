'use client';

import { useState, useEffect } from 'react';

import styles from './FilterBar.module.scss';

import { regionList, dtlRegionList } from '@/types/common/region';

interface Props {
  onFilterChange: (filters: { style: string; region: string; dtlRegion: string; sort: string }) => void;
}

export default function FilterBar({ onFilterChange }: Props) {
  const [style, setStyle] = useState('');
  const [region, setRegion] = useState('');
  const [dtlRegion, setDtlRegion] = useState('');
  const [sort, setSort] = useState('latest');

  // 선택한 시·도에 따라 구·군 목록 필터링
  const filteredDtlRegion = dtlRegionList.filter((r) => r.regionName === region);

  // 필터 변경 시 상위로 전달
  useEffect(() => {
    onFilterChange({ style, region, dtlRegion, sort });
  }, [style, region, dtlRegion, sort]);

  return (
    <div className={styles.filterBar}>
      {/* 진행 방식 */}
      <select className={styles.select} value={style} onChange={(e) => setStyle(e.target.value)}>
        <option value="">진행 방식</option>
        <option value="독서">독서</option>
        <option value="토론">토론</option>
        <option value="자유">자유</option>
      </select>

      {/* 시·도 */}
      <select
        className={styles.select}
        value={region}
        onChange={(e) => {
          setRegion(e.target.value);
          setDtlRegion('');
        }}>
        <option value="">지역 선택</option>
        {regionList.map((r) => (
          <option key={r.code} value={r.name}>
            {r.name}
          </option>
        ))}
      </select>

      {/* 구·군 */}
      <select
        className={styles.select}
        value={dtlRegion}
        onChange={(e) => setDtlRegion(e.target.value)}
        disabled={!region}>
        <option value="">세부 지역</option>
        {filteredDtlRegion.map((r) => (
          <option key={r.code} value={r.dtlRegionName}>
            {r.dtlRegionName}
          </option>
        ))}
      </select>

      {/* 정렬 탭 */}
      <div className={styles.sortTabs}>
        <button
          className={`${styles.tab} ${sort === 'latest' ? styles.active : ''}`}
          onClick={() => setSort('latest')}>
          최신순
        </button>
        <button
          className={`${styles.tab} ${sort === 'popular' ? styles.active : ''}`}
          onClick={() => setSort('popular')}>
          인기순
        </button>
      </div>
    </div>
  );
}
