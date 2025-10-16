import styles from '@/components/books/book.module.scss';

interface ReviewListAboutBookProps {
  isbn: string;
}

function ReviewListAboutBook({ isbn }: ReviewListAboutBookProps) {
  return (
    <section className={styles.book_navigation}>
      <div>이 도서에 대한 리뷰 리스트 영역입니다.</div>
    </section>
  );
}

export default ReviewListAboutBook;
