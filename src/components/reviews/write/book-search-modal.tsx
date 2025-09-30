'use client';

import Image from 'next/image';
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

  // 도서 검색 함수
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!keyword.trim()) {
      alert('검색어를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      const response = await fetchAladin.searchBooks(keyword, 20);

      if (response.item && response.item.length > 0) {
        setSearchResults(response.item);
      } else {
        setSearchResults([]);
        alert('검색 결과가 없습니다.');
      }
    } catch (error) {
      console.error('도서 검색 실패:', error);
      alert('도서 검색에 실패했습니다.');
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 도서 선택 핸들러
  const handleSelectBook = (book: AladinBook) => {
    onSelect(book);
  };

  return (
    <div
      className={styles.modalOverlay}
      onClick={onClose}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Escape' && onClose()}>
      <div className={styles.modalContent} role="document">
        <div className={styles.modalHeader}>
          <h2>도서 검색</h2>
          <button onClick={onClose} className={styles.closeButton}>
            ✕
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

        <div className={styles.searchResults}>
          {isLoading ? (
            <div className={styles.loading}>검색 중입니다...</div>
          ) : hasSearched && searchResults.length === 0 ? (
            <div className={styles.noResults}>검색 결과가 없습니다.</div>
          ) : (
            searchResults.map((book) => (
              <button key={book.itemId} className={styles.bookItem} onClick={() => handleSelectBook(book)}>
                <Image
                  src={book.cover}
                  alt={book.title}
                  width={80}
                  height={120}
                  className={styles.bookCover}
                />
                <div className={styles.bookInfo}>
                  <h3 className={styles.bookTitle}>{book.title}</h3>
                  <p className={styles.bookAuthor}>{book.author}</p>
                  <p className={styles.bookPublisher}>
                    {book.publisher} | {book.pubDate}
                  </p>
                  <p className={styles.bookIsbn}>ISBN: {book.isbn13}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default BookSearchModal;
