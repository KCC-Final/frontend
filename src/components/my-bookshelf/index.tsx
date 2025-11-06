'use client';

import { useState, useEffect } from 'react';

import BookCard from './book-card';
import CategoryList from './category-list';
import CategoryModal from './category-modal';
import styles from './my-bookshelf.module.scss';

import { fetchGroo } from '@/apis';
import type { AladinBookDetailsItem } from '@/types';
import type { Bookshelf, BookScrap } from '@/types/bookshelf/bookshelf';

interface BookWithDetails extends BookScrap {
  details?: AladinBookDetailsItem;
}

function MyBookshelf() {
  // 탭 상태
  const [activeSection, setActiveSection] = useState<'bookshelf' | 'all'>('bookshelf');

  // 책장 관련 상태
  const [bookshelves, setBookshelves] = useState<Bookshelf[]>([]);
  const [selectedBookshelf, setSelectedBookshelf] = useState<number | null>(null);
  const [books, setBooks] = useState<BookWithDetails[]>([]);
  const [allBooks, setAllBooks] = useState<BookWithDetails[]>([]);

  // 모달 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBookshelf, setEditingBookshelf] = useState<Bookshelf | null>(null);

  // 로딩 상태
  const [isLoading, setIsLoading] = useState(false);

  // 초기 데이터 로드
  useEffect(() => {
    fetchBookshelves();
  }, []);

  // 선택된 책장의 도서 로드
  useEffect(() => {
    if (selectedBookshelf && activeSection === 'bookshelf') {
      fetchBooks(selectedBookshelf);
    }
  }, [selectedBookshelf, activeSection]);

  // 모든 책 로드
  useEffect(() => {
    if (activeSection === 'all') {
      fetchAllBooks();
    }
  }, [activeSection, bookshelves]);

  // 책장 목록 조회
  const fetchBookshelves = async () => {
    try {
      const data = await fetchGroo.bookshelf.getBookshelfList();
      setBookshelves(data);
      if (data.length > 0) {
        setSelectedBookshelf(data[0].bookshelfId);
      }
    } catch (error) {}
  };

  // 선택된 책장의 도서 조회
  const fetchBooks = async (bookshelfId: number) => {
    setIsLoading(true);
    try {
      const scraps = await fetchGroo.bookshelf.getBookScrapList(bookshelfId);

      // 알라딘 API로 도서 상세 정보 가져오기
      const { fetchAladin } = await import('@/apis/aladin');
      const booksWithDetails = await Promise.all(
        scraps.map(async (scrap) => {
          try {
            const details = await fetchAladin.getBookDetails(scrap.ISBN);
            return {
              ...scrap,
              details: details.item?.[0]
            };
          } catch (error) {
            return scrap;
          }
        })
      );

      setBooks(booksWithDetails);
    } catch (error) {
      setBooks([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 모든 스크랩 도서 조회
  const fetchAllBooks = async () => {
    if (bookshelves.length === 0) return;

    setIsLoading(true);
    try {
      // 모든 책장의 스크랩 가져오기
      const allScraps: BookScrap[] = [];
      for (const shelf of bookshelves) {
        const scraps = await fetchGroo.bookshelf.getBookScrapList(shelf.bookshelfId);
        allScraps.push(...scraps);
      }

      // 중복 제거 (같은 ISBN)
      const uniqueScraps = Array.from(new Map(allScraps.map((item) => [item.ISBN, item])).values());

      // 알라딘 API로 도서 상세 정보 가져오기
      const { fetchAladin } = await import('@/apis/aladin');
      const booksWithDetails = await Promise.all(
        uniqueScraps.map(async (scrap) => {
          try {
            const details = await fetchAladin.getBookDetails(scrap.ISBN);
            return {
              ...scrap,
              details: details.item?.[0]
            };
          } catch (error) {
            return scrap;
          }
        })
      );

      setAllBooks(booksWithDetails);
    } catch (error) {
      setAllBooks([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 책장 추가 모달 열기
  const handleAddBookshelf = () => {
    setEditingBookshelf(null);
    setIsModalOpen(true);
  };

  // 책장 수정 모달 열기
  const handleEditBookshelf = (bookshelf: Bookshelf) => {
    setEditingBookshelf(bookshelf);
    setIsModalOpen(true);
  };

  // 책장 삭제
  const handleDeleteBookshelf = async (bookshelfId: number) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      try {
        await fetchGroo.bookshelf.deleteBookshelf(bookshelfId);
        await fetchBookshelves();
      } catch (error) {
        alert('책장 삭제에 실패했습니다.');
      }
    }
  };

  // 책장 저장 (추가/수정)
  const handleSaveBookshelf = async (name: string) => {
    try {
      if (editingBookshelf) {
        await fetchGroo.bookshelf.updateBookshelf(editingBookshelf.bookshelfId, { name });
      } else {
        await fetchGroo.bookshelf.createBookshelf({ name });
      }

      setIsModalOpen(false);
      await fetchBookshelves();
    } catch (error) {
      alert('책장 저장에 실패했습니다.');
    }
  };

  // 현재 표시할 도서 목록
  const displayBooks = activeSection === 'bookshelf' ? books : allBooks;

  return (
    <div className={styles.container}>
      {/* 상단 타이틀 */}
      <div className={styles.page_header}>
        <h1 className={styles.page_title}>내 책장</h1>
      </div>

      {/* 섹션 탭 */}
      <div className={styles.section_tabs}>
        <button
          className={`${styles.section_tab} ${activeSection === 'bookshelf' ? styles.active : ''}`}
          onClick={() => setActiveSection('bookshelf')}>
          책장
        </button>
        <button
          className={`${styles.section_tab} ${activeSection === 'all' ? styles.active : ''}`}
          onClick={() => setActiveSection('all')}>
          모든 책
        </button>
      </div>

      {/* 컨텐츠 영역 */}
      <div className={styles.content}>
        {/* 왼쪽: 카테고리 목록 (책장 섹션일 때만 표시) */}
        {activeSection === 'bookshelf' && (
          <CategoryList
            bookshelves={bookshelves}
            selectedBookshelf={selectedBookshelf}
            onSelectBookshelf={setSelectedBookshelf}
            onAddBookshelf={handleAddBookshelf}
            onEditBookshelf={handleEditBookshelf}
            onDeleteBookshelf={handleDeleteBookshelf}
          />
        )}

        {/* 오른쪽: 도서 목록 */}
        <div className={styles.books_area}>
          {isLoading ? (
            <div className={styles.empty_message}>로딩 중...</div>
          ) : displayBooks.length > 0 ? (
            <div className={styles.books_grid}>
              {displayBooks.map((book) => (
                <BookCard key={`${book.bookshelfId}-${book.ISBN}`} book={book} />
              ))}
            </div>
          ) : (
            <div className={styles.empty_message}>
              {activeSection === 'bookshelf' ? '저장된 도서가 없습니다.' : '스크랩한 도서가 없습니다.'}
            </div>
          )}
        </div>
      </div>

      {/* 카테고리 추가/수정 모달 */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveBookshelf}
        bookshelf={editingBookshelf}
      />
    </div>
  );
}

export default MyBookshelf;
