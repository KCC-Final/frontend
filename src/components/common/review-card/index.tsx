'use client';

import { BookIcon, Heart, MessageSquareMore, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { fetchAladin } from '@/apis';
import styles from '@/components/common/review-card/review-card.module.scss';
import { ReviewData } from '@/types';
import { changeImageUrlFromBase64 } from '@/utils/format/base64';
import { formatRelativeTime } from '@/utils/format/date';

interface ReviewCardProps {
  review: ReviewData;
}

function ReviewCard({ review }: ReviewCardProps) {
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [isImgLoading, setImgLoading] = useState(true);
  const [imgFetchingError, setImgFetchingError] = useState(false);

  useEffect(() => {
    // isbn이 없으면 이미지 로딩 실패 처리
    if (!review.isbn) {
      setImgLoading(false);
      setImgFetchingError(true);
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
        console.error('Failed to fetch book cover image:', error);
        setImgFetchingError(true);
      } finally {
        setImgLoading(false);
      }
    };

    getCoverImageUrl();
  }, [review.isbn]);

  // 커버 이미지 URL 결정 (로딩 중이거나 에러 시 기본 이미지 사용)
  const finalImgSrc = !isImgLoading && !imgFetchingError && imgUrl ? imgUrl : null;

  // 작성자 프로필 이미지 URL 변환
  const authorProfileImageUrl = changeImageUrlFromBase64(review.authorProfileImage);

  return (
    <li className={styles.container}>
      {/* 커버 이미지 섹션 (클릭 가능) */}
      <Link href={`/reviews/${review.reviewId}`}>
        <div
          className={styles.cover_bg}
          style={
            finalImgSrc ? ({ '--background-image': `url(${finalImgSrc})` } as React.CSSProperties) : undefined
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
              width={120}
              height={180}
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
        <Link href={`/my-feeds?userId=${review.userId}`}>
          <span className={styles.img}>
            {review.authorProfileImage ? (
              <Image src={authorProfileImageUrl} alt="프로필 이미지" width={27} height={27} />
            ) : (
              <User size={18} />
            )}
          </span>
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
