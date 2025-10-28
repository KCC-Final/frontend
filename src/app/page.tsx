import { cookies } from 'next/headers';

import { fetchAladin } from '@/apis/aladin';
import { fetchGrooInServer } from '@/apis/groo/server';
import { fetchLibrary } from '@/apis/library';
import { fetchNLLibrary } from '@/apis/nl-library';
import GlobalLayout from '@/components/common/layout';
import BestsellerList from '@/components/home/bestseller';
import HotTrendBooks from '@/components/home/hot-trend-books';
import LibrarianRecommendList from '@/components/home/librarian-recommend';
import PopularLoanBooks from '@/components/home/popular-loan-books';
import RegionalReadingChart from '@/components/home/regional-reading-chart'; //  추가
import TodaySentence from '@/components/home/today-sentence';
import { Book } from '@/types';
import { getTokenInCookie } from '@/utils/cookie';

async function BookRecommendationPage() {
  // 서버 컴포넌트에서 쿠키를 가져옵니다.
  const cookieStore = await cookies();
  const token = getTokenInCookie(cookieStore);

  // 날짜 계산 (최근 1개월)
  const today = new Date();
  const endDate = today.toISOString().split('T')[0];
  const startDate = new Date(today.setMonth(today.getMonth() - 1)).toISOString().split('T')[0];

  console.log('[메인 페이지] 날짜 범위:', { startDate, endDate });

  // 데이터 페칭 (오늘의 한 문장, 베스트셀러)
  const [quoteData, bestsellerResponse] = await Promise.all([
    fetchGrooInServer.book.getDailyQuote(token),
    fetchAladin.getBestSellers(16)
  ]);

  // 사서 추천 도서 데이터 페칭 (에러 발생 시 빈 배열)
  let librarianRecommendBooks = [];
  try {
    const librarianRecommendResponse = await fetchNLLibrary.getLibrarianRecommendBooks(1, 16);
    librarianRecommendBooks = Array.isArray(librarianRecommendResponse.channel?.list)
      ? librarianRecommendResponse.channel.list.map((entry: any) => entry.item)
      : librarianRecommendResponse.channel?.list?.item
        ? [librarianRecommendResponse.channel.list.item]
        : [];
  } catch (error) {
    console.error('사서 추천 도서 조회 실패:', error);
  }

  // 초기 인기 대출도서 데이터 페칭 (전국 기준)
  let initialPopularBooks: Book[] = [];
  try {
    console.log('[메인 페이지] 초기 인기 대출도서 API 호출');

    const response = await fetchLibrary.getPopularBooks(
      startDate,
      endDate,
      1, // pageNo
      10 // pageSize
    );

    console.log('[메인 페이지] 초기 인기 대출도서 응답:', response?.response ? '성공' : '실패');

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

      console.log('[메인 페이지] 초기 인기 대출도서 변환 완료:', initialPopularBooks.length, '개');
    }
  } catch (error) {
    console.error('[메인 페이지] 초기 인기 대출도서 조회 실패:', error);
  }

  // 프롭으로 전달할 데이터
  const initialQuoteData = quoteData || null;
  const bestsellerBooks = bestsellerResponse.item || [];

  console.log('[메인 페이지] 렌더링 준비 완료:', {
    quote: !!initialQuoteData,
    bestsellers: bestsellerBooks.length,
    librarian: librarianRecommendBooks.length,
    popular: initialPopularBooks.length
  });

  return (
    <GlobalLayout wide={true}>
      <TodaySentence initialQuoteData={initialQuoteData.data} />
      <BestsellerList books={bestsellerBooks} />
      {librarianRecommendBooks.length > 0 && <LibrarianRecommendList books={librarianRecommendBooks} />}
      <HotTrendBooks /> {/*  기존 대출급상승 도서 섹션 */}
      <RegionalReadingChart /> {/*  지역별 독서량/독서율 섹션 추가 */}
      <PopularLoanBooks initialBooks={initialPopularBooks} />
    </GlobalLayout>
  );
}

export default BookRecommendationPage;
