'use client';

import clsx from 'clsx';
import { Trophy, Award, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/shallow';

import { challenge } from '@/apis/groo/challenge';
import styles from '@/components/dashboard/badges/badge-section.module.scss';
import useBoundStore from '@/stores';
import { UserBadgeStatusResponse, BadgeCategory, BADGE_CATEGORY_MAP, BADGE_ICONS } from '@/types';

function BadgeSection() {
  const { userId } = useBoundStore(useShallow((state) => ({ userId: state.myInfo!.userId })));

  const [badges, setBadges] = useState<UserBadgeStatusResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<BadgeCategory | 'all'>('all');
  const [expandedBadge, setExpandedBadge] = useState<number | null>(null);

  useEffect(() => {
    const loadUserAndBadges = async () => {
      try {
        setLoading(true);

        // 해당 유저의 전체 뱃지 상태 조회
        const badgeList = await challenge.getAllBadgesWithStatus(userId);
        setBadges(badgeList);
      } catch (err: any) {
        console.error('뱃지 조회 실패:', err);
      } finally {
        setLoading(false);
      }
    };

    loadUserAndBadges();
  }, []);

  const getFilteredBadges = () => {
    if (selectedCategory === 'all') return badges;
    return badges.filter((b) => BADGE_CATEGORY_MAP[b.badgeName] === selectedCategory);
  };

  const getCategoryStats = (category: BadgeCategory) => {
    const categoryBadges = badges.filter((b) => BADGE_CATEGORY_MAP[b.badgeName] === category);
    const acquired = categoryBadges.filter((b) => b.acquired).length;
    return {
      total: categoryBadges.length,
      acquired,
      percentage: categoryBadges.length ? Math.round((acquired / categoryBadges.length) * 100) : 0
    };
  };

  const getTotalStats = () => {
    const acquired = badges.filter((b) => b.acquired).length;
    return {
      total: badges.length,
      acquired,
      percentage: badges.length ? Math.round((acquired / badges.length) * 100) : 0
    };
  };

  const toggleBadgeDetails = (id: number) => {
    setExpandedBadge(expandedBadge === id ? null : id);
  };

  // 로딩
  if (loading) return null;

  const totalStats = getTotalStats();
  const filteredBadges = getFilteredBadges();

  return (
    <div className={styles.badgeSection}>
      {/* 헤더 */}
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>
          <Trophy size={24} />
          도전과제 뱃지
        </h2>
        <div className={styles.totalProgress}>
          <span className={styles.progressText}>
            {totalStats.acquired}/{totalStats.total} 획득 ({totalStats.percentage}%)
          </span>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${totalStats.percentage}%` }} />
          </div>
        </div>
      </div>

      {/* 카테고리 탭 */}
      <div className={styles.categoryTabs}>
        <button
          className={`${styles.tabButton} ${selectedCategory === 'all' ? styles.active : ''}`}
          onClick={() => setSelectedCategory('all')}>
          전체
          <span className={styles.badgeCount}>
            {totalStats.acquired}/{totalStats.total}
          </span>
        </button>

        {Object.values(BadgeCategory).map((category) => {
          const stats = getCategoryStats(category);
          return (
            <button
              key={category}
              className={`${styles.tabButton} ${selectedCategory === category ? styles.active : ''}`}
              onClick={() => setSelectedCategory(category)}>
              {category}
              <span className={styles.badgeCount}>
                {stats.acquired}/{stats.total}
              </span>
            </button>
          );
        })}
      </div>

      {/* 뱃지 목록 */}
      <div className={styles.badgeGrid}>
        {filteredBadges.map((badge) => (
          <div
            key={badge.badgeId}
            className={`${styles.badgeCard} ${badge.acquired ? styles.acquired : styles.locked}`}
            onClick={() => toggleBadgeDetails(badge.badgeId)}>
            <div className={styles.badgeIcon}>
              <span className={styles.emoji}>{BADGE_ICONS[badge.badgeName] || '🏅'}</span>
              {badge.acquired && (
                <div className={styles.checkMark}>
                  <Star size={16} fill="white" />
                </div>
              )}
            </div>

            <div className={styles.badgeInfo}>
              <h4 className={styles.badgeName}>{badge.badgeName}</h4>
              <p
                className={clsx(styles.badgeDescription, {
                  [styles.small]: badge.badgeDescription.length > 24
                })}>
                {badge.badgeDescription}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* 빈 상태 */}
      {filteredBadges.length === 0 && (
        <div className={styles.emptyState}>
          <Award size={48} />
          <p>해당 카테고리에 뱃지가 없습니다.</p>
        </div>
      )}
    </div>
  );
}

export default BadgeSection;
