import { Lock } from 'lucide-react';
import { useEffect, useState } from 'react';

import styles from './review-card.module.scss';

import { fetchAladin } from '@/apis';
import { ReviewData } from '@/types/reviews';
import { changeImageUrlFromBase64 } from '@/utils/format/base64';

interface ReviewCardProps {
  review: ReviewData;
  onClick: (reviewId: number) => void;
  showSecretBadge?: boolean;
}

export default function ReviewCard({ review, onClick, showSecretBadge = true }: ReviewCardProps) {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // 1. customThumbnail이 있으면 바로 사용
    if (review.customThumbnail) {
      setImageUrl(review.customThumbnail);
      setLoading(false);
      setError(false);
      return;
    }

    // 2. customThumbnail이 없으면 Aladin API로 도서 이미지 가져오기
    if (!review.isbn) {
      setLoading(false);
      setError(true);
      return;
    }

    const fetchBookCover = async () => {
      try {
        setError(false);
        const data = await fetchAladin.getBookDetails(review.isbn);

        if (data.item && data.item[0] && data.item[0].cover) {
          setImageUrl(data.item[0].cover);
        } else {
          setError(true);
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchBookCover();
  }, [review.isbn, review.customThumbnail]);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const getInitial = (name: string) => (name ? name.charAt(0).toUpperCase() : 'U');

  const convertedProfileImage = changeImageUrlFromBase64(review.authorProfileImage);

  return (
    <article className={styles.reviewCard} onClick={() => onClick(review.reviewId)}>
      {/* 16:9 비율의 썸네일 영역 */}
      <div className={styles.thumbnailContainer}>
        {/* 메인 이미지 */}
        {loading ? (
          <div className={styles.loadingState}>
            <span>로딩 중...</span>
          </div>
        ) : imageUrl && !error ? (
          <img src={imageUrl} alt={review.reviewTitle} className={styles.thumbnailImage} />
        ) : (
          <div className={styles.noImageState}>
            <span>이미지 없음</span>
          </div>
        )}
      </div>

      <div className={styles.reviewInfo}>
        <div className={styles.userInfo}>
          {convertedProfileImage ? (
            <img
              src={convertedProfileImage}
              alt={review.authorNickname || review.userId}
              className={styles.avatar}
            />
          ) : (
            <div className={styles.avatarPlaceholder}>
              {getInitial(review.authorNickname || review.userId)}
            </div>
          )}
          <div className={styles.userDetails}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span className={styles.nickname}>{review.authorNickname || review.userId}</span>
              {showSecretBadge && review.secret && (
                <div className={styles.secretBadge}>
                  <Lock size={16} />
                </div>
              )}
            </div>
            <span className={styles.date}>{formatDate(review.createdAt)}</span>
          </div>
        </div>

        <h2 className={styles.reviewTitle}>{review.reviewTitle}</h2>

        <p className={styles.category}>{review.category}</p>

        <div className={styles.reviewContent}>
          {review.reviewContent?.replace(/<[^>]*>/g, '').substring(0, 100)}...
        </div>

        <div className={styles.stats}>
          <span className={styles.stat}>좋아요 {review.likeCount || 0}</span>
          <span className={styles.stat}>댓글 {review.commentCount || 0}</span>
        </div>
      </div>
    </article>
  );
}
