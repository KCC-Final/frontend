import { cookies } from 'next/headers';

import { fetchAladin } from '@/apis/aladin';
import { fetchGrooInServer } from '@/apis/groo/server';
import BestsellerList from '@/components/home/bestseller';
import TodaySentence from '@/components/home/today-sentence';
import HeaderLayout from '@/components/layout/header';
import MainLayout from '@/components/layout/main';
import { getTokenInCookie } from '@/utils/cookie';

async function BookRecommendationPage() {
  // 서버 컴포넌트에서 쿠키를 가져옵니다.
  const cookieStore = await cookies();
  const token = getTokenInCookie(cookieStore);

  // 데이터 페칭 (오늘의 한 문장, 베스트셀러)
  const [quoteData, bestsellerResponse] = await Promise.all([
    fetchGrooInServer.book.getDailyQuote(token),
    fetchAladin.getBestSellers(16)
  ]);

  // 프롭으로 전달할 데이터
  const initialQuoteData = quoteData || null;
  const bestsellerBooks = bestsellerResponse.item || [];

  return (
    <>
      <HeaderLayout />
      <MainLayout>
        <TodaySentence initialQuoteData={initialQuoteData.data} />
        <BestsellerList books={bestsellerBooks} />
      </MainLayout>
    </>
  );
}

export default BookRecommendationPage;
