import BookDetails from '@/components/books/details';
import LibraryInformation from '@/components/books/library';
import BookProfileCard from '@/components/books/profile-card';
import ReviewListAboutBook from '@/components/books/reviews';
import { AladinBookDetailsItem } from '@/types';

interface BookInformationProps {
  bookInfo: AladinBookDetailsItem;
}

function BookInformation({ bookInfo }: BookInformationProps) {
  return (
    <>
      <BookProfileCard bookInfo={bookInfo} />
      <nav>
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
