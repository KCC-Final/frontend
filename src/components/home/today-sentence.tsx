'use client';

import { format } from 'date-fns';
import Link from 'next/link';

import backgroundImg from '@/assets/sentence_background.png';
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
      <Link
        href={`/books/${quoteData.sentence.isbn}`}
        style={{
          backgroundImage: `url(${backgroundImg.src})`
        }}>
        <div className={styles.content}>
          <div className={styles.sentence}>
            <p>{quoteData.sentence.sentenceContent}</p>
          </div>
          <div className={styles.description}>
            {/* 도서 제목에 겹낫표 추가 */}
            <div className={styles.bookTitle}>「{formatBookTitle(quoteData.book.title)}」</div>
            <div className={styles.bookAuthor}>{formatBookAuthor(quoteData.book.author)}</div>
          </div>
        </div>
      </Link>
    </section>
  );
}

export default TodaySentence;
