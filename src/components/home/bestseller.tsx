import Image from 'next/image';
import Link from 'next/link';

import styles from '@/components/home/home.module.scss';
import { AladinBestsellerItem } from '@/types/aladin/dto';
import { formatBookAuthor, formatBookTitle } from '@/utils/format/string';

interface BestsellerListProps {
  books: AladinBestsellerItem[];
}

function BestsellerList({ books }: BestsellerListProps) {
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
