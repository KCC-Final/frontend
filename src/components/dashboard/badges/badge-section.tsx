'use client';

import clsx from 'clsx';
import { Trophy, Award, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/shallow';

import { challenge } from '@/apis/groo/challenge';
import styles from '@/components/dashboard/badges/badge-section.module.scss';
import MonthlyBadgeModal from '@/components/dashboard/badges/monthly-badge-modal';
import useBoundStore from '@/stores';
import { UserBadgeStatusResponse, BadgeCategory, BADGE_CATEGORY_MAP, BADGE_ICONS } from '@/types';

// 반복 수여(히스토리형) 뱃지 목록
const HISTORICAL_BADGES = ['이달의 독서왕'];

function BadgeSection() {
  const { userId } = useBoundStore(useShallow((state) => ({ userId: state.myInfo?.userId })));

  const [badges, setBadges] = useState<UserBadgeStatusResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<BadgeCategory | 'all'>('all');

  // 모달 관련 상태
  const [showModal, setShowModal] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState<UserBadgeStatusResponse | null>(null);
  const [isHistoryMode, setIsHistoryMode] = useState(false);

  useEffect(() => {
    const loadUserAndBadges = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        const badgeList = await challenge.getAllBadgesWithStatus(userId);
        setBadges(badgeList);
      } catch (err: any) {
      } finally {
        setLoading(false);
      }
    };

    loadUserAndBadges();
  }, [userId]);

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

  // 클릭 시 처리: 획득한 뱃지만 모달 표시
  const handleBadgeClick = (badge: UserBadgeStatusResponse) => {
    // 획득하지 않은 뱃지는 클릭 불가
    if (!badge.acquired) return;

    setSelectedBadge(badge);
    setIsHistoryMode(HISTORICAL_BADGES.includes(badge.badgeName));
    setShowModal(true);
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
            className={clsx(styles.badgeCard, {
              [styles.acquired]: badge.acquired,
              [styles.locked]: !badge.acquired,
              [styles.clickable]: badge.acquired
            })}
            onClick={() => handleBadgeClick(badge)}>
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

      {/* 뱃지 모달 (히스토리 & 일반 뱃지 모두 처리) */}
      {showModal && selectedBadge && (
        <MonthlyBadgeModal
          userId={userId ? userId : ''}
          onClose={() => setShowModal(false)}
          badgeId={isHistoryMode ? selectedBadge.badgeId : undefined}
          badge={selectedBadge}
        />
      )}
    </div>
  );
}

export default BadgeSection;
