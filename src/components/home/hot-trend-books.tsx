'use client';

import { format } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';

import styles from './hot-trend-books.module.scss';

import { fetchLibrary } from '@/apis/library';
import BookCard from '@/components/common/book/book-card';

interface TrendDoc {
  isbn13: string;
  bookname: string;
  authors: string;
  publisher?: string;
  publication_year?: string;
  bookImageURL?: string;
}

export default function HotTrendBooks() {
  const [books, setBooks] = useState<TrendDoc[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const today = format(new Date(), 'yyyy-MM-dd');
        const response = await fetchLibrary.getHotTrendBooks(today);
        const results = response?.response?.results;

        if (!Array.isArray(results)) return;

        const seen = new Set<string>();
        const all: TrendDoc[] = [];

        for (const r of results) {
          const docs = r?.result?.docs ?? [];
          for (const d of docs) {
            const doc: TrendDoc | undefined = d?.doc;
            if (!doc?.isbn13 || seen.has(doc.isbn13)) continue;
            seen.add(doc.isbn13);
            all.push(doc);
          }
        }

        setBooks(all.slice(0, 12));
      } catch (err) {
        console.error('대출 급상승 도서를 불러오는 중 오류:', err);
      }
    };

    loadBooks();
  }, []);

  const scroll = (dir: 'left' | 'right') => {
    const el = ref.current;
    if (!el) return;
    const cardWidth = 160;
    const gap = 24;
    const count = 4;
    const amount = (cardWidth + gap) * count;
    el.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  if (books.length === 0) return null;

  const showArrows = books.length > 6;

  return (
    <section className={styles.trend_section}>
      <h2 className={styles.title}>대출 급상승 도서</h2>
      <p className={styles.subtitle}>최근 3일간 급상승 도서</p>

      <div className={styles.nav}>
        {showArrows && (
          <button
            className={`${styles.arrow} ${styles.left}`}
            onClick={() => scroll('left')}
            aria-label="이전 도서">
            <ChevronLeft size={20} />
          </button>
        )}

        <div className={styles.track} ref={ref}>
          {books.map((b) => (
            <div key={b.isbn13} className={styles.item}>
              <BookCard
                isbn={b.isbn13}
                title={b.bookname}
                author={b.authors}
                cover={b.bookImageURL ?? ''}
                publisher={b.publisher}
                pubYear={b.publication_year}
              />
            </div>
          ))}
        </div>

        {showArrows && (
          <button
            className={`${styles.arrow} ${styles.right}`}
            onClick={() => scroll('right')}
            aria-label="다음 도서">
            <ChevronRight size={20} />
          </button>
        )}
      </div>
    </section>
  );
}
