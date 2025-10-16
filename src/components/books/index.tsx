import ReviewListAboutBook from './reviews';

import styles from '@/components/books/book.module.scss';
import BookDetails from '@/components/books/details';
import LibraryInformation from '@/components/books/library';
import BookProfileCard from '@/components/books/profile-card';
import { AladinBookDetailsItem } from '@/types';

interface BookInformationProps {
  bookInfo: AladinBookDetailsItem;
}

function BookInformation({ bookInfo }: BookInformationProps) {
  return (
    <>
      <BookProfileCard bookInfo={bookInfo} />
      <nav className={styles.navigation}>
        <ul>
          <li>도서 소개</li>
          <li>독후감</li>
          <li>도서관</li>
        </ul>
      </nav>
      <BookDetails bookInfo={bookInfo} />
      <ReviewListAboutBook isbn={bookInfo.isbn13} />
      <LibraryInformation isbn={bookInfo.isbn13} />
    </>
  );
}

export default BookInformation;
