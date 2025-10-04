'use client';

import { useState } from 'react';

import { fetchAladin } from '@/apis';
import styles from '@/components/reviews/write/book-search-modal.module.scss';
import { useInputText } from '@/hooks/useInput';
import { AladinBook } from '@/types/reviews';

interface BookSearchModalProps {
  onSelect: (book: AladinBook) => void;
  onClose: () => void;
}

function BookSearchModal({ onSelect, onClose }: BookSearchModalProps) {
  const [keyword, changeKeyword] = useInputText('');
  const [searchResults, setSearchResults] = useState<AladinBook[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string>('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!keyword.trim()) {
      alert('검색어를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setHasSearched(true);
    setError('');

    try {
      const response = await fetchAladin.searchBooks(keyword, 20);

      if (response.item && response.item.length > 0) {
        setSearchResults(response.item);
      } else {
        setSearchResults([]);
        alert('검색 결과가 없습니다.');
      }
    } catch {
      setError('도서 검색에 실패했습니다.');
      setSearchResults([]);
      alert('도서 검색에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectBook = (book: AladinBook) => {
    onSelect(book);
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>도서 검색</h2>
          <button onClick={onClose} className={styles.closeButton}>
            X
          </button>
        </div>

        <form onSubmit={handleSearch} className={styles.searchForm}>
          <input
            type="text"
            value={keyword}
            onChange={changeKeyword}
            placeholder="도서 제목 또는 저자를 입력하세요"
            className={styles.searchInput}
          />
          <button type="submit" className={styles.searchButton} disabled={isLoading}>
            {isLoading ? '검색 중...' : '검색'}
          </button>
        </form>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <div className={styles.searchResults}>
          {isLoading ? (
            <div className={styles.loading}>검색 중입니다...</div>
          ) : hasSearched && searchResults.length === 0 ? (
            <div className={styles.noResults}>검색 결과가 없습니다.</div>
          ) : (
            searchResults.map((book) => (
              <div key={book.itemId} className={styles.bookItem} onClick={() => handleSelectBook(book)}>
                <img
                  src={book.cover}
                  alt={book.title}
                  className={styles.bookCover}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/default-book-cover.png';
                  }}
                />
                <div className={styles.bookInfo}>
                  <h3 className={styles.bookTitle}>{book.title}</h3>
                  <p className={styles.bookAuthor}>{book.author}</p>
                  <p className={styles.bookPublisher}>
                    {book.publisher} | {book.pubDate}
                  </p>
                  <p className={styles.bookIsbn}>ISBN: {book.isbn13}</p>
                  <p className={styles.bookCategory}>{book.categoryName}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default BookSearchModal;
