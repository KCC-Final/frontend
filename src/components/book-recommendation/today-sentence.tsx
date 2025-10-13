'use client';

import { format } from 'date-fns';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { fetchGroo } from '@/apis/groo';
import styles from '@/components/book-recommendation/book-recommendation.module.scss';
import { DailyQuoteData } from '@/types';
import { setMidnightTimer } from '@/utils/time';

function TodaySentence() {
  const [quoteData, setQuoteData] = useState<DailyQuoteData | null>(null);

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const response = await fetchGroo.book.getDailyQuote();
        if (response.data) {
          setQuoteData(response.data);
        }
      } catch (error) {
        console.error('오늘의 한 문장을 불러오는 데 실패했습니다.', error);
        setQuoteData(null);
      }
    };

    // 1. 최초 데이터 호출
    fetchQuote();

    // 2. 유틸 함수로 타이머 설정하고, cleanup 함수를 받아옴
    const cleanup = setMidnightTimer(fetchQuote);

    // 3. 컴포넌트 언마운트 시 cleanup 실행
    return cleanup;
  }, []);

  if (!quoteData) {
    return null;
  }

  return (
    <Link href="/" className={styles.sentences}>
      <div className={styles.content}>
        <div className={styles.date}>{format(new Date(quoteData.sentence.selectedDate), 'yyyy-MM-dd')}</div>
        <div className={styles.sentence}>
          <p>{quoteData.sentence.sentenceContent}</p>
        </div>
        <div className={styles.description}>
          <div>{quoteData.book.title}</div>
          <div>{quoteData.book.author}</div>
        </div>
      </div>
    </Link>
  );
}

export default TodaySentence;
