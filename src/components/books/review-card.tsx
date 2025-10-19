'use client';

import { Heart, MessageCircle, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import styles from '@/components/books/reviews.module.scss';
import { ReviewData } from '@/types';

interface ReviewCardProps {
  review: ReviewData;
  coverUrl: string;
}

function ReviewCard({ review, coverUrl }: ReviewCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/reviews/${review.reviewId}`);
  };

  return (
    <div className={styles.review_card}>
      {/* 커버 이미지 섹션 (클릭 가능) */}
      <div
        className={styles.card_cover}
        style={{ '--background-image': `url(${coverUrl})` } as React.CSSProperties}
        onClick={handleCardClick}>
        <Image
          className={styles.cover_img}
          src={coverUrl}
          alt={review.reviewTitle}
          width={150}
          height={230}
        />
      </div>

      {/* 카드 콘텐츠 섹션 */}
      <div className={styles.card_content}>
        {/* 작성자 정보 */}
        <div className={styles.author_info}>
          <div className={styles.author_avatar}>
            <User size={24} />
          </div>
          <div className={styles.author_details}>
            <Link href={`/my-feeds?userId=${review.userId}`} className={styles.author_nickname}>
              {review.userId}
            </Link>
            <span className={styles.created_at}>{new Date(review.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* 독후감 제목 및 내용 (클릭 가능) */}
        <div className={styles.card_body} onClick={handleCardClick}>
          <h4 className={styles.review_title}>{review.reviewTitle}</h4>
          <p className={styles.review_content}>{review.reviewContent.replace(/<[^>]+>/g, '')}</p>
        </div>

        {/* 독후감 통계 */}
        <div className={styles.card_footer}>
          <div className={styles.stats}>
            <Heart size={16} />
            <span>{review.likeCount}</span>
          </div>
          <div className={styles.stats}>
            <MessageCircle size={16} />
            <span>{review.commentCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReviewCard;
