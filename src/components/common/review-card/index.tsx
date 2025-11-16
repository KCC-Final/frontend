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

  const [bookCoverUrl, setBookCoverUrl] = useState<string | null>(null);
  const [isBookCoverLoading, setIsBookCoverLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadImage = async () => {
      const thumb = review.customThumbnail?.trim?.();
      if (thumb) {
        if (isMounted) {
          setImgUrl(thumb);
          setHasCustomThumbnail(true);
          setImgLoading(false);
          setImgFetchingError(false);

          if (review.isbn) {
            setIsBookCoverLoading(true);
            try {
              const result = await fetchAladin.getBookDetails(review.isbn);
              const cover = result?.item?.[0]?.cover;
              if (cover && isMounted) {
                setBookCoverUrl(cover);
              }
            } catch (err) {
              console.error('Failed to load book cover:', err);
            } finally {
              if (isMounted) {
                setIsBookCoverLoading(false);
              }
            }
          }
        }
        return;
      }

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

  const finalImgSrc = imgUrl && !imgFetchingError ? imgUrl : null;

  return (
    <li
      className={clsx(
        styles.container,
        size === 'sm' ? styles.small : size === 'md' ? styles.medium : styles.large
      )}>
      <Link href={`/reviews/${review.reviewId}`}>
        <div className={styles.cover_bg}>
          {!hasCustomThumbnail && finalImgSrc && (
            <div className={styles.blur_bg} style={{ backgroundImage: `url(${finalImgSrc})` }} />
          )}

          {isImgLoading && (
            <div className={styles.placeholder}>
              <div className={styles.spinner}></div>
            </div>
          )}

          {!isImgLoading && imgFetchingError && (
            <div className={styles.placeholder}>
              <BookIcon size={60} color="#aaaaaa" />
            </div>
          )}

          {finalImgSrc && (
            <>
              {hasCustomThumbnail ? (
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

          {hasCustomThumbnail && bookCoverUrl && (
            <div className={styles.book_overlay}>
              <img
                src={bookCoverUrl}
                alt="도서 표지"
                className={styles.book_overlay_img}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}
        </div>
      </Link>

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
