'use client';

import { format } from 'date-fns';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { fetchGroo } from '@/apis/groo';
import styles from '@/components/home/home.module.scss';
import { DailyQuoteData } from '@/types';
import { formatBookAuthor, formatBookTitle } from '@/utils/format/string';
import { setMidnightTimer } from '@/utils/time';

interface TodaySentenceProps {
  initialQuoteData: DailyQuoteData | null;
}

function TodaySentence({ initialQuoteData }: TodaySentenceProps) {
  const [quoteData, setQuoteData] = useState<DailyQuoteData | null>(initialQuoteData);

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

    // 유틸 함수로 타이머 설정하고, cleanup 함수를 받아옴
    const cleanup = setMidnightTimer(fetchQuote);

    // 컴포넌트 언마운트 시 cleanup 실행
    return cleanup;
  }, []);

  if (!quoteData) {
    return null;
  }

  return (
    <section className={styles.quote}>
      <Link href={`/books/${quoteData.sentence.isbn}`}>
        <div className={styles.content}>
          <div className={styles.date}>{format(new Date(quoteData.sentence.selectedDate), 'yyyy-MM-dd')}</div>
          <div className={styles.sentence}>
            <p>{quoteData.sentence.sentenceContent}</p>
          </div>
          <div className={styles.description}>
            <div>{formatBookTitle(quoteData.book.title)}</div>
            <div>{formatBookAuthor(quoteData.book.author)}</div>
          </div>
        </div>
      </Link>
    </section>
  );
}

export default TodaySentence;
