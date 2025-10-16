import styles from '@/components/books/book.module.scss';

interface LibraryInformationProps {
  isbn: string;
}

function LibraryInformation({ isbn }: LibraryInformationProps) {
  return (
    <section>
      <div>도서 상세정보 영역입니다.</div>
    </section>
  );
}

export default LibraryInformation;
