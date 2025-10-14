import BestsellerList from '@/components/home/bestseller';
import TodaySentence from '@/components/home/today-sentence';
import HeaderLayout from '@/components/layout/header';
import MainLayout from '@/components/layout/main';

function BookRecommendationPage() {
  return (
    <>
      <HeaderLayout />
      <MainLayout>
        <TodaySentence />
        <BestsellerList />
      </MainLayout>
    </>
  );
}

export default BookRecommendationPage;
