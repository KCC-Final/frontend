'use client';

import { BookOpen, Bookmark, Heart } from 'lucide-react';

import styles from './stats-cards.module.scss';

import { StatsCardsProps } from '@/types/dashboard/dashboard';

interface StatCard {
  label: string;
  value: number;
  icon: React.ReactNode;
  colorClass: string;
}

export default function StatsCards({ totalReviews, totalScrappedBooks, totalLikedReviews }: StatsCardsProps) {
  const statCards: StatCard[] = [
    {
      label: '작성한 독후감',
      value: totalReviews,
      icon: <BookOpen size={24} />,
      colorClass: styles.iconReviews
    },
    {
      label: '읽고 싶은 책',
      value: totalScrappedBooks,
      icon: <Bookmark size={24} />,
      colorClass: styles.iconScraps
    },
    {
      label: '좋아하는 독후감',
      value: totalLikedReviews,
      icon: <Heart size={24} />,
      colorClass: styles.iconLikes
    }
  ];

  return (
    <div className={styles.statsGrid}>
      {statCards.map((stat, index) => (
        <div key={index} className={styles.statCard}>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>{stat.label}</span>
            <span className={styles.statValue}>{stat.value.toLocaleString()}</span>
          </div>
          <div className={`${styles.statIcon} ${stat.colorClass}`}>{stat.icon}</div>
        </div>
      ))}
    </div>
  );
}
