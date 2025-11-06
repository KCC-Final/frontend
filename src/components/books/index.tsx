'use client';

import { useState, useEffect, useRef } from 'react';

import BookProfileCardButtons from '@/components/books/card-buttons';
import BookDetails from '@/components/books/details';
import LibraryInformation from '@/components/books/library';
import BookNavigation from '@/components/books/navigation';
import ReviewListAboutBook from '@/components/books/reviews';
import BookProfileCard from '@/components/common/book/profile-card';
import { useBookStore } from '@/stores/book';
import { AladinBookDetailsItem } from '@/types';

interface BookInformationProps {
  bookInfo: AladinBookDetailsItem;
}

function BookInformation({ bookInfo }: BookInformationProps) {
  const { fetchBookStats } = useBookStore();
  const [activeSection, setActiveSection] = useState('details');

  const detailsRef = useRef<HTMLElement>(null);
  const reviewsRef = useRef<HTMLElement>(null);
  const libraryRef = useRef<HTMLElement>(null);

  const handleNavClick = (section: 'details' | 'reviews' | 'library') => {
    let ref;
    switch (section) {
      case 'details':
        ref = detailsRef;
        break;
      case 'reviews':
        ref = reviewsRef;
        break;
      case 'library':
        ref = libraryRef;
        break;
    }

    ref.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target.id === 'details') setActiveSection('details');
            if (entry.target.id === 'reviews') setActiveSection('reviews');
            if (entry.target.id === 'library') setActiveSection('library');
          }
        });
      },
      { rootMargin: '-50% 0px -50% 0px', threshold: 0 }
    );

    const refs = [detailsRef, reviewsRef, libraryRef];
    refs.forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => {
      refs.forEach((ref) => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
    };
  }, []);

  useEffect(() => {
    if (bookInfo.isbn13) fetchBookStats(bookInfo.isbn13);
  }, [bookInfo.isbn13, fetchBookStats]);

  return (
    <>
      <BookProfileCard bookInfo={bookInfo}>
        <BookProfileCardButtons isbn={bookInfo.isbn13} />
      </BookProfileCard>
      <BookNavigation onNavClick={handleNavClick} activeSection={activeSection} />
      <BookDetails bookInfo={bookInfo} ref={detailsRef} id="details" />
      <ReviewListAboutBook isbn={bookInfo.isbn13} coverUrl={bookInfo.cover} ref={reviewsRef} id="reviews" />
      <LibraryInformation isbn={bookInfo.isbn13} ref={libraryRef} id="library" />
    </>
  );
}

export default BookInformation;
