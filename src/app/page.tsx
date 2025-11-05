import { fetchLibrary } from '@/apis';
import GlobalLayout from '@/components/common/layout';
import BookRecommendation from '@/components/home';
import { Book } from '@/types';

async function BookRecommendationPage() {
  // 날짜 계산 (최근 1개월)
  const today = new Date();
  const endDate = today.toISOString().split('T')[0];
  const startDate = new Date(today.setMonth(today.getMonth() - 1)).toISOString().split('T')[0];

  // 초기 인기 대출도서 데이터 페칭 (전국 기준)
  let initialPopularBooks: Book[] = [];
  try {
    const response = await fetchLibrary.getPopularBooks(startDate, endDate, 1, 12);

    if (response?.response?.docs?.doc) {
      const docs = Array.isArray(response.response.docs.doc)
        ? response.response.docs.doc
        : [response.response.docs.doc];

      initialPopularBooks = docs.map((doc: any, index: number) => ({
        no: doc.no || index + 1,
        ranking: doc.ranking || index + 1,
        bookname: doc.bookname,
        authors: doc.authors,
        publisher: doc.publisher,
        publication_year: doc.publication_year,
        isbn13: doc.isbn13,
        addition_symbol: doc.addition_symbol,
        vol: doc.vol,
        class_no: doc.class_no,
        class_nm: doc.class_nm,
        bookImageURL: doc.bookImageURL,
        bookDtlUrl: doc.bookDtlUrl,
        loan_count: doc.loan_count
      }));
    }
  } catch (error) {
    console.error('[메인 페이지] 초기 인기 대출도서 조회 실패:', error);
  }
  return (
    <GlobalLayout wide={true}>
      <BookRecommendation initialPopularBooks={initialPopularBooks} />
    </GlobalLayout>
  );
}

export default BookRecommendationPage;
