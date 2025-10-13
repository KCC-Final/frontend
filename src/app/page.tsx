import BookList from '@/components/home/book-list';
import TodaySentence from '@/components/home/today-sentence';
import HeaderLayout from '@/components/layout/header';
import MainLayout from '@/components/layout/main';

function BookRecommendationPage() {
  return (
    <>
      <HeaderLayout />
      <MainLayout>
        <TodaySentence />
        <BookList />
      </MainLayout>
    </>
  );
}

export default BookRecommendationPage;
