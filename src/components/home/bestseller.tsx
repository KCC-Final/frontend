'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { fetchAladin } from '@/apis/aladin';
import styles from '@/components/home/home.module.scss';
import { AladinBestsellerItem } from '@/types/aladin/dto';
import { formatBookAuthor, formatBookTitle } from '@/utils/format/string';

function BestsellerList() {
  const [books, setBooks] = useState<AladinBestsellerItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setIsLoading(true);
        const response = await fetchAladin.getBestSellers(16);
        setBooks(response.item);
      } catch (err) {
        setError('베스트셀러 목록을 불러오는 데 실패했습니다.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <section className={styles.bestseller}>
      <h1>베스트셀러</h1>
      <div className={styles.items}>
        {books.map((book) => (
          <div key={book.itemId} className={styles.item}>
            <Link href={`/books/${book.isbn13}`}>
              <div className={styles.cover}>
                <Image src={book.cover} alt={book.title} fill sizes="180px" />
                <span className={styles.rank}>{book.bestRank}</span>
              </div>
              <div className={styles.info}>
                <div className={styles.title}>{formatBookTitle(book.title)}</div>
                <div className={styles.author}>{formatBookAuthor(book.author)}</div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

export default BestsellerList;
