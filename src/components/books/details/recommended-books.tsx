'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react'; // 추가
import { useEffect, useState } from 'react';

import styles from './recommended-books.module.scss';

import { fetchAladin } from '@/apis/aladin';
import { fetchLibrary } from '@/apis/library';
import BookCard from '@/components/common/book/book-card';
import type { AladinBookDetailsItem } from '@/types';

type RecommendedBooksProps = {
  isbn13: string;
};

export default function RecommendedBooks({ isbn13 }: RecommendedBooksProps) {
  const [activeTab, setActiveTab] = useState<'mania' | 'reader'>('mania');
  const [maniaBooks, setManiaBooks] = useState<AladinBookDetailsItem[]>([]);
  const [readerBooks, setReaderBooks] = useState<AladinBookDetailsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecommendedBooks();
  }, [isbn13]);

  const fetchRecommendedBooks = async () => {
    try {
      setLoading(true);
      const response = await fetchLibrary.getBookUsageAnalysis(isbn13);

      if (response?.response) {
        const maniaISBNs: string[] = [];
        const readerISBNs: string[] = [];

        if (response.response.maniaRecBooks) {
          response.response.maniaRecBooks.forEach((item: any) => {
            if (item.book?.isbn13) {
              maniaISBNs.push(item.book.isbn13);
            }
          });
        }

        if (response.response.readerRecBooks) {
          response.response.readerRecBooks.forEach((item: any) => {
            if (item.book?.isbn13) {
              readerISBNs.push(item.book.isbn13);
            }
          });
        }

        const maniaDetails = await Promise.all(
          maniaISBNs.map(async (isbn) => {
            try {
              const details = await fetchAladin.getBookDetails(isbn);
              return details.item[0];
            } catch (error) {
              console.error(`마니아 추천 도서 ${isbn} 조회 실패:`, error);
              return null;
            }
          })
        );

        const readerDetails = await Promise.all(
          readerISBNs.map(async (isbn) => {
            try {
              const details = await fetchAladin.getBookDetails(isbn);
              return details.item[0];
            } catch (error) {
              console.error(`다독자 추천 도서 ${isbn} 조회 실패:`, error);
              return null;
            }
          })
        );

        setManiaBooks(maniaDetails.filter((book) => book !== null) as AladinBookDetailsItem[]);
        setReaderBooks(readerDetails.filter((book) => book !== null) as AladinBookDetailsItem[]);
      }
    } catch (error) {
      console.error('추천 도서 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentBooks = activeTab === 'mania' ? maniaBooks : readerBooks;

  if (loading) {
    return (
      <section className={styles.recommended_books}>
        <h2 className={styles.section_title}>추천 도서</h2>
        <div className={styles.loading}>로딩 중...</div>
      </section>
    );
  }

  if (maniaBooks.length === 0 && readerBooks.length === 0) {
    return null;
  }

  return (
    <section className={styles.recommended_books}>
      <h2 className={styles.section_title}>추천 도서</h2>

      <div className={styles.tab_container}>
        <button
          className={`${styles.tab_button} ${activeTab === 'mania' ? styles.active : ''}`}
          onClick={() => setActiveTab('mania')}>
          마니아를 위한 추천 ({maniaBooks.length})
        </button>
        <button
          className={`${styles.tab_button} ${activeTab === 'reader' ? styles.active : ''}`}
          onClick={() => setActiveTab('reader')}>
          다독자를 위한 추천 ({readerBooks.length})
        </button>
      </div>

      <div className={styles.books_carousel}>
        <button
          className={styles.arrow_left}
          onClick={() => {
            const container = document.getElementById('bookScrollContainer');
            if (container) container.scrollBy({ left: -300, behavior: 'smooth' });
          }}>
          <ChevronLeft size={20} />
        </button>

        <div className={styles.books_scroll_wrapper} id="bookScrollContainer">
          {currentBooks.map((book) => (
            <BookCard
              key={book.isbn13}
              isbn={book.isbn13}
              title={book.title}
              author={book.author}
              cover={book.cover}
              publisher={book.publisher}
              pubYear={book.pubDate ? book.pubDate.split('-')[0] : ''}
            />
          ))}
        </div>

        <button
          className={styles.arrow_right}
          onClick={() => {
            const container = document.getElementById('bookScrollContainer');
            if (container) container.scrollBy({ left: 300, behavior: 'smooth' });
          }}>
          <ChevronRight size={20} />
        </button>
      </div>
    </section>
  );
}
