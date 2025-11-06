'use client';

import { format } from 'date-fns';
import Link from 'next/link';

import styles from '@/components/home/home.module.scss';
import { useHomeStore } from '@/stores/home';
import { formatBookAuthor, formatBookTitle } from '@/utils/format/string';

function TodaySentence() {
  const { quoteData } = useHomeStore();

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
