import styles from '@/components/books/book.module.scss';
import { AladinBookDetailsItem } from '@/types';

interface BookDetailsProps {
  bookInfo: AladinBookDetailsItem;
}

function BookDetails({ bookInfo }: BookDetailsProps) {
  return (
    <section>
      <div>도서 상세정보 영역입니다.</div>
    </section>
  );
}

export default BookDetails;
