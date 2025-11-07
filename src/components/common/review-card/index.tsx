'use client';

import clsx from 'clsx';
import { BookIcon, Heart, MessageSquareMore } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { fetchAladin } from '@/apis';
import UserProfileImage from '@/components/common/profile/image';
import styles from '@/components/common/review-card/review-card.module.scss';
import { ReviewData } from '@/types';
import { formatRelativeTime } from '@/utils/format/date';

interface ReviewCardProps {
  review: ReviewData;
  size?: 'sm' | 'md' | 'lg';
  useDicebearCover?: boolean;
}

function ReviewCard({ review, size = 'lg', useDicebearCover = false }: ReviewCardProps) {
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [isImgLoading, setImgLoading] = useState(true);
  const [imgFetchingError, setImgFetchingError] = useState(false);

  useEffect(() => {
    // isbn이 없으면 이미지 로딩 실패 처리
    if (review.customThumbnail) {
      setImgUrl(review.customThumbnail);
      setImgLoading(false);
      setImgFetchingError(false);
      return;
    }
    /** 이미지 URL 가져오기 함수 */
    const getCoverImageUrl = async () => {
      // 상태 초기화
      setImgUrl(null);
      setImgLoading(true);
      setImgFetchingError(false);

      // Aladin API로 도서 상세 정보 요청
      try {
        const result = await fetchAladin.getBookDetails(review.isbn);

        if (result.item && result.item.length > 0 && result.item[0].cover) {
          setImgUrl(result.item[0].cover);
        } else {
          setImgFetchingError(true);
        }
      } catch (error) {
        setImgFetchingError(true);
      } finally {
        setImgLoading(false);
      }
    };

    getCoverImageUrl();
  }, [review.isbn]);

  // 커버 이미지 URL 결정 (로딩 중이거나 에러 시 기본 이미지 사용)
  const finalImgSrc = !isImgLoading && !imgFetchingError && imgUrl ? imgUrl : null;

  // dicebear 배경 URL 생성 (reviewId를 시드로 사용)
  const dicebearBgUrl = `url(https://api.dicebear.com/9.x/glass/svg?seed=${review.reviewId})`;

  return (
    <li
      className={clsx(
        styles.container,
        size === 'sm' ? styles.small : size === 'md' ? styles.medium : styles.large
      )}>
      {/* 커버 이미지 섹션 (클릭 가능) */}
      <Link href={`/reviews/${review.reviewId}`}>
        <div
          className={`${styles.cover_bg} ${useDicebearCover ? styles.dicebear : styles.normal}`}
          style={
            useDicebearCover
              ? ({ '--background-image': dicebearBgUrl } as React.CSSProperties)
              : finalImgSrc
                ? ({ '--background-image': `url(${finalImgSrc})` } as React.CSSProperties)
                : undefined
          }>
          {/* 로딩 중 UI */}
          {isImgLoading && (
            <div className={styles.placeholder}>
              <div className={styles.spinner}></div>
            </div>
          )}
          {/* 에러 또는 이미지 없음 UI */}
          {!isImgLoading && imgFetchingError && (
            <div className={styles.placeholder}>
              <BookIcon size={60} color="#aaaaaa" />
            </div>
          )}
          {/* 이미지 로딩 성공 UI */}
          {finalImgSrc && (
            <Image
              className={styles.cover_img}
              src={finalImgSrc}
              alt={review.reviewTitle}
              fill={true}
              sizes="120px"
              priority={false}
              onError={() => setImgFetchingError(true)}
            />
          )}
        </div>
      </Link>

      {/* 카드 콘텐츠 섹션 */}
      <div className={styles.info}>
        <Link href={`/reviews/${review.reviewId}`}>
          <h4 className={styles.title}>{review.reviewTitle}</h4>
          <p className={styles.description}>{review.reviewContent.replace(/<[^>]+>/g, '')}</p>
        </Link>
        <div className={styles.stats}>
          <div>
            <span className={styles.created_at}>{formatRelativeTime(review.createdAt)}</span>
          </div>
          <div>
            <Heart size={14} color="#555555" />
            <span>{review.likeCount}</span>
          </div>
          <div>
            <MessageSquareMore size={14} color="#555555" />
            <span>{review.commentCount}</span>
          </div>
        </div>
      </div>

      <footer className={styles.footer}>
        <Link href={`/users/${review.userId}`}>
          <UserProfileImage
            userId={review.userId}
            profileImage={review.authorProfileImage}
            size={size === 'sm' ? 23 : 27}
          />
          <span className={styles.author}>
            <span>by</span>
            <span>{review.authorNickname}</span>
          </span>
        </Link>
      </footer>
    </li>
  );
}

export default ReviewCard;
