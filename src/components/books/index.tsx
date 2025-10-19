'use client';

import { useState, useEffect, useRef } from 'react';

import BookDetails from '@/components/books/details';
import LibraryInformation from '@/components/books/library';
import BookNavigation from '@/components/books/navigation';
import BookProfileCard from '@/components/books/profile-card';
import ReviewListAboutBook from '@/components/books/reviews';
import { AladinBookDetailsItem } from '@/types';

interface BookInformationProps {
  bookInfo: AladinBookDetailsItem;
}

function BookInformation({ bookInfo }: BookInformationProps) {
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
      { rootMargin: '-50% 0px -50% 0px', threshold: 0 } // 화면 중앙에 올 때를 기준으로 판단
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

  return (
    <>
      <BookProfileCard bookInfo={bookInfo} />
      <BookNavigation onNavClick={handleNavClick} activeSection={activeSection} />
      <BookDetails bookInfo={bookInfo} ref={detailsRef} id="details" />
      <ReviewListAboutBook isbn={bookInfo.isbn13} coverUrl={bookInfo.cover} ref={reviewsRef} id="reviews" />
      <LibraryInformation isbn={bookInfo.isbn13} ref={libraryRef} id="library" />
    </>
  );
}

export default BookInformation;
