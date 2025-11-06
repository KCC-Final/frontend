'use client';

import styles from './review-content.module.scss';

import { ReviewDetailResDTO } from '@/types/reviews';

type Props = {
  reviewData: ReviewDetailResDTO['data'];
};

export default function ReviewContent({ reviewData }: Props) {
  return (
    <div className={styles.container}>
      <article className={styles.content}>
        <div className={styles.body} dangerouslySetInnerHTML={{ __html: reviewData.reviewContent }} />
      </article>
    </div>
  );
}
