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
}

function ReviewCard({ review, size = 'lg' }: ReviewCardProps) {
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [isImgLoading, setImgLoading] = useState(true);
  const [imgFetchingError, setImgFetchingError] = useState(false);
  const [hasCustomThumbnail, setHasCustomThumbnail] = useState(false);
  useEffect(() => {
    let isMounted = true;

    const loadImage = async () => {
      // 커스텀 썸네일 우선
      const thumb = review.customThumbnail?.trim?.();
      if (thumb) {
        if (isMounted) {
          setImgUrl(thumb);
          setHasCustomThumbnail(true);
          setImgLoading(false);
          setImgFetchingError(false);
        }
        return;
      }

      // 썸네일 없을 때만 도서 커버 불러오기
      if (!review.isbn) {
        if (isMounted) {
          setImgUrl(null);
          setImgLoading(false);
          setImgFetchingError(true);
        }
        return;
      }

      try {
        if (isMounted) {
          setImgLoading(true);
          setImgFetchingError(false);
        }

        const result = await fetchAladin.getBookDetails(review.isbn);

        if (isMounted) {
          const cover = result?.item?.[0]?.cover;
          if (cover) {
            setImgUrl(cover);
            setHasCustomThumbnail(false);
          } else {
            setImgFetchingError(true);
          }
        }
      } catch (err) {
        if (isMounted) setImgFetchingError(true);
      } finally {
        if (isMounted) setImgLoading(false);
      }
    };

    loadImage();
    return () => {
      isMounted = false;
    };
  }, [review.isbn, review.customThumbnail]);

  // 썸네일 우선 렌더링
  const finalImgSrc = imgUrl && !imgFetchingError ? imgUrl : null;

  return (
    <li
      className={clsx(
        styles.container,
        size === 'sm' ? styles.small : size === 'md' ? styles.medium : styles.large
      )}>
      {/* 커버 이미지 섹션 */}
      <Link href={`/reviews/${review.reviewId}`}>
        <div className={styles.cover_bg}>
          {/* 도서 표지 블러 배경 (customThumbnail 없을 때만) */}
          {!hasCustomThumbnail && finalImgSrc && (
            <div className={styles.blur_bg} style={{ backgroundImage: `url(${finalImgSrc})` }} />
          )}

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

          {/* 이미지 표시 */}
          {finalImgSrc && (
            <>
              {hasCustomThumbnail ? (
                // 커스텀 썸네일 (기존 그대로)
                <Image
                  className={styles.cover_img}
                  src={finalImgSrc}
                  alt={review.reviewTitle}
                  fill={true}
                  sizes="120px"
                  style={{ objectFit: 'cover' }}
                  priority={false}
                  onError={() => setImgFetchingError(true)}
                />
              ) : (
                // 썸네일 없을 때 — 도서 원본 비율 유지 + 블러 배경
                <div className={styles.book_fallback_wrapper}>
                  <div
                    className={styles.book_fallback_bg}
                    style={{ backgroundImage: `url(${finalImgSrc})` }}
                  />
                  <img
                    className={styles.book_fallback_img}
                    src={finalImgSrc}
                    alt={review.reviewTitle}
                    onError={() => setImgFetchingError(true)}
                  />
                </div>
              )}
            </>
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
