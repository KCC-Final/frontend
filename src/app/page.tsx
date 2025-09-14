import RecommendationByApi from '@/components/book-recommendation/recommendation-by-api';
import RecommendationByUser from '@/components/book-recommendation/recommendation-by-user';
import IntegratedSearch from '@/components/book-recommendation/search';
import TodaySentence from '@/components/book-recommendation/today-sentence';
import HeaderLayout from '@/components/layout/header';
import MainLayout from '@/components/layout/main';

function BookRecommendationPage() {
  return (
    <>
      <HeaderLayout />
      <MainLayout>
        <TodaySentence />
        <IntegratedSearch />
        <RecommendationByUser />
        <RecommendationByApi />
      </MainLayout>
    </>
  );
}

export default BookRecommendationPage;
