'use client';

import { useEffect } from 'react';

import PopularBooks from './PopularBooks';

import PageLoading from '@/components/common/loading';
import BestsellerList from '@/components/home/bestseller';
import HotTrendBooks from '@/components/home/hot-trend-books';
import LibrarianRecommendList from '@/components/home/librarian-recommend';
import PopularLoanBooks from '@/components/home/popular-loan-books';
import RecommendationSection from '@/components/home/RecommendationSection';
import TodaySentence from '@/components/home/today-sentence';
import { useHomeStore } from '@/stores/home';
import { Book } from '@/types';

interface BookRecommendationProps {
  initialPopularBooks: Book[];
}

function BookRecommendation({ initialPopularBooks }: BookRecommendationProps) {
  const { loading, fetchTopHomeData } = useHomeStore();

  useEffect(() => {
    fetchTopHomeData();
  }, [fetchTopHomeData]);

  if (loading) {
    return <PageLoading />;
  }

  return (
    <>
      <TodaySentence />
      <BestsellerList />
      <LibrarianRecommendList />
      <RecommendationSection limit={20} />
      <PopularBooks />
      <PopularLoanBooks initialBooks={initialPopularBooks} />
      <HotTrendBooks />
    </>
  );
}

export default BookRecommendation;
