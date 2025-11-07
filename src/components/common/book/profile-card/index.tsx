'use client';

import { Bookmark, BookOpen } from 'lucide-react';
import Image from 'next/image';
import { useEffect } from 'react';

import styles from '@/components/common/book/profile-card/profile-card.module.scss';
import { useBookStore } from '@/stores/book';
import { AladinBookDetailsItem } from '@/types';
import { formatBookAuthor, formatBookTitle } from '@/utils/format/string';

interface BookProfileCardProps {
  bookInfo: AladinBookDetailsItem;
  size?: 'sm' | 'md';
  children?: React.ReactNode;
}

function BookProfileCard({ bookInfo, size = 'md', children }: BookProfileCardProps) {
  const { isbn, reviewCount, scrapCount, fetchBookStats } = useBookStore();

  const ratingPercentage = (bookInfo.customerReviewRank / 10) * 100;

  useEffect(() => {
    if (isbn === null || isbn !== bookInfo.isbn13) {
      fetchBookStats(bookInfo.isbn13);
    }
  }, [bookInfo.isbn13, fetchBookStats, isbn]);

  return (
    <>
      <section className={`${styles.book_card} ${size === 'sm' ? styles.small : styles.medium}`}>
        <div
          className={styles.cover}
          style={{ '--background-image': `url(${bookInfo.cover})` } as React.CSSProperties}>
          <Image className={styles.img} src={bookInfo.cover} alt={bookInfo.title} width={160} height={240} />
        </div>
        <div className={styles.info}>
          <div className={styles.header}>
            <div className={styles.category}>{bookInfo.categoryName}</div>
            <div className={styles.title}>{formatBookTitle(bookInfo.title)}</div>
          </div>
          <div className={styles.content}>
            <div className={styles.book}>
              <div className={styles.author}>
                <span>저자</span>
                <span>{formatBookAuthor(bookInfo.author)}</span>
              </div>
              <div className={styles.date}>
                <span>출간일</span>
                <span>{bookInfo.pubDate}</span>
              </div>
              <div className={styles.isbn}>
                <span>ISBN</span>
                <span>{bookInfo.isbn13}</span>
              </div>
            </div>
            <div className={styles.groo}>
              <div className={styles.review}>
                <span>독후감</span>
                <span>
                  <span>
                    <BookOpen size="18px" color="#333333" />
                  </span>
                  <span>{reviewCount}</span>
                </span>
              </div>
              <div className={styles.scrap}>
                <span>스크랩</span>
                <span>
                  <span>
                    <Bookmark size="18px" color="#333333" />
                  </span>
                  <span>{scrapCount}</span>
                </span>
              </div>
              <div className={styles.rank}>
                <span>평점</span>
                <div className={styles.rating_display}>
                  <div className={styles.stars}>
                    <div className={styles.background}>★★★★★</div>
                    <div className={styles.fill} style={{ width: `${ratingPercentage}%` }}>
                      ★★★★★
                    </div>
                  </div>
                  <span className={styles.score_text}>{(bookInfo.customerReviewRank / 2).toFixed(1)}</span>
                </div>
              </div>
            </div>
          </div>
          <span className={styles.divider} />
          <div className={styles.description}>
            <span>책소개</span>
            <p>{bookInfo.description}</p>
          </div>
          {children}
        </div>
      </section>
    </>
  );
}

export default BookProfileCard;
