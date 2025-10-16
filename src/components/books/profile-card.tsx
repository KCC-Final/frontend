import styles from '@/components/books/book.module.scss';
import { AladinBookDetailsItem } from '@/types';

interface BookProfileCardProps {
  bookInfo: AladinBookDetailsItem;
}

function BookProfileCard({ bookInfo }: BookProfileCardProps) {
  return (
    <section className={styles.book_card}>
      <div>도서정보 프로필카드 영역입니다.</div>
    </section>
  );
}

export default BookProfileCard;
