'use client';

import { BookOpen, Bookmark, Heart } from 'lucide-react';

import styles from '@/components/dashboard/stats/stats-cards.module.scss';
import { useDashboardStore } from '@/stores/dashboard';

function StatsCards() {
  const { totalReviews, totalScrappedBooks, totalLikedReviews } = useDashboardStore(
    (state) => state.dashboardData
  );

  return (
    <section className={styles.statsGrid}>
      <div className={styles.statCard}>
        <div className={styles.statContent}>
          <span className={styles.title}>작성한 독후감</span>
          <span className={styles.statValue}>{totalReviews}</span>
        </div>
        <div className={`${styles.statIcon} ${styles.iconReviews}`}>
          <Bookmark size={24} />
        </div>
      </div>

      <div className={styles.statCard}>
        <div className={styles.statContent}>
          <span className={styles.title}>읽고 싶은 책</span>
          <span className={styles.statValue}>{totalScrappedBooks}</span>
        </div>
        <div className={`${styles.statIcon} ${styles.iconLikes}`}>
          <BookOpen size={24} />
        </div>
      </div>

      <div className={styles.statCard}>
        <div className={styles.statContent}>
          <span className={styles.title}>좋아하는 독후감</span>
          <span className={styles.statValue}>{totalLikedReviews}</span>
        </div>
        <div className={`${styles.statIcon} ${styles.iconReviews}`}>
          <Heart size={24} />
        </div>
      </div>
    </section>
  );
}

export default StatsCards;
