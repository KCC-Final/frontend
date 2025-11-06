'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';

import { fetchGroo } from '@/apis';
import ReviewCard from '@/components/books/review-card';
import styles from '@/components/books/reviews.module.scss';
import { ReviewData } from '@/types';

interface ReviewListAboutBookProps {
  isbn: string;
  coverUrl: string;
  ref?: React.Ref<HTMLElement>;
  id?: string;
}

const SCROLL_AMOUNT = 320 + 40; // Card width + gap

function ReviewListAboutBook({ isbn, coverUrl, ref, id }: ReviewListAboutBookProps) {
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollability = () => {
    const el = scrollRef.current;
    if (el) {
      const isScrollable = el.scrollWidth > el.clientWidth;
      setCanScrollLeft(isScrollable && el.scrollLeft > 0);
      setCanScrollRight(isScrollable && el.scrollLeft < el.scrollWidth - el.clientWidth);
    }
  };

  const handleScroll = () => {
    checkScrollability();
  };

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -SCROLL_AMOUNT, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: SCROLL_AMOUNT, behavior: 'smooth' });
  };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setIsLoading(true);
        const fetchedReviews = await fetchGroo.review.getReviewsByIsbn(isbn);
        setReviews(fetchedReviews);
      } catch (e) {
        setError('독후감을 불러오는 데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [isbn]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      checkScrollability();
      el.addEventListener('scroll', handleScroll);
      window.addEventListener('resize', checkScrollability);

      return () => {
        el.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', checkScrollability);
      };
    }
  }, [reviews, isLoading]);

  const renderContent = () => {
    if (isLoading) {
      return <div className={styles.message_box}>독후감을 불러오는 중입니다...</div>;
    }

    if (error) {
      return <div className={styles.message_box}>{error}</div>;
    }

    if (reviews.length === 0) {
      return <div className={styles.message_box}>작성된 독후감이 없습니다.</div>;
    }

    return (
      <div className={styles.carousel_container}>
        {canScrollLeft && (
          <button
            className={`${styles.scroll_button} ${styles.left}`}
            onClick={scrollLeft}
            aria-label="scroll left">
            <ChevronLeft />
          </button>
        )}
        <div className={styles.carousel_wrapper} ref={scrollRef}>
          <div className={styles.carousel_list}>
            {reviews.map((review) => (
              <ReviewCard key={review.reviewId} review={review} coverUrl={coverUrl} />
            ))}
          </div>
        </div>
        {canScrollRight && (
          <button
            className={`${styles.scroll_button} ${styles.right}`}
            onClick={scrollRight}
            aria-label="scroll right">
            <ChevronRight />
          </button>
        )}
      </div>
    );
  };

  return (
    <section className={styles.book_reviews} ref={ref} id={id}>
      <h2 className={styles.section_title}>이 도서에 대한 독후감</h2>
      {renderContent()}
    </section>
  );
}

export default ReviewListAboutBook;
