'use client';

import clsx from 'clsx';

import styles from '@/components/books/navigation.module.scss';

interface BookNavigationProps {
  onNavClick: (section: 'details' | 'reviews' | 'library') => void;
  activeSection: string;
}

function BookNavigation({ onNavClick, activeSection }: BookNavigationProps) {
  return (
    <nav className={styles.navigation}>
      <ul>
        <li>
          <button
            onClick={() => onNavClick('details')}
            className={clsx({ [styles.active]: activeSection === 'details' })}>
            도서 소개
          </button>
        </li>
        <li>
          <button
            onClick={() => onNavClick('reviews')}
            className={clsx({ [styles.active]: activeSection === 'reviews' })}>
            독후감
          </button>
        </li>
        <li>
          <button
            onClick={() => onNavClick('library')}
            className={clsx({ [styles.active]: activeSection === 'library' })}>
            도서관
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default BookNavigation;
