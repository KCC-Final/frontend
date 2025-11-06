'use client';

import { useState, useCallback, useEffect } from 'react';

import styles from './popular-loan-books.module.scss';

import { fetchAladin } from '@/apis/aladin';
import { fetchLibrary } from '@/apis/library';
import BookCard from '@/components/common/book/book-card';
import { Book } from '@/types';
import { REGION_OPTIONS, AGE_OPTIONS, GENDER_OPTIONS } from '@/types/common/library_code';
import { formatBookAuthor, formatBookTitle } from '@/utils/format/string';

// 필터 옵션 타입 정의
type FilterOption = {
  code: string;
  name: string;
  apiCode: string;
};

type FilterCategory = 'region' | 'age' | 'gender';

interface PopularLoanBooksProps {
  initialBooks: Book[];
}

function PopularLoanBooks({ initialBooks }: PopularLoanBooksProps) {
  const [activeCategory, setActiveCategory] = useState<FilterCategory>('region');
  const [activeFilter, setActiveFilter] = useState({
    region: 'all',
    age: 'all',
    gender: 'all'
  });
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // 페이지 로드시 자동 데이터 로드
  useEffect(() => {
    if (!initialBooks || initialBooks.length === 0) {
      fetchFilteredBooks('region', 'all');
    } else {
      setBooks(initialBooks.slice(0, 6)); // 초기 데이터도 6개로 제한
    }
  }, []);

  // 현재 카테고리에 따른 옵션 리스트 반환
  const getCurrentOptions = (): FilterOption[] => {
    switch (activeCategory) {
      case 'region':
        return REGION_OPTIONS;
      case 'age':
        return AGE_OPTIONS;
      case 'gender':
        return GENDER_OPTIONS;
      default:
        return [];
    }
  };

  // 카테고리 이름 반환
  const getCategoryName = (category: FilterCategory): string => {
    switch (category) {
      case 'region':
        return '지역별';
      case 'age':
        return '연령별';
      case 'gender':
        return '성별';
      default:
        return '';
    }
  };

  // --- 필터별 데이터 호출 (최적화) ---
  const fetchFilteredBooks = useCallback(async (category: FilterCategory, value: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const today = new Date();
      const endDate = today.toISOString().split('T')[0];
      const start = new Date();
      start.setMonth(today.getMonth() - 3);
      const startDate = start.toISOString().split('T')[0];

      // 공통 파라미터
      const params: Record<string, any> = {
        startDt: startDate,
        endDt: endDate,
        pageNo: 1,
        pageSize: 6, // 6개로 변경 (2줄)
        format: 'json'
      };

      // ======================
      // 필터 조건 (단일 선택 전용)
      // ======================
      if (category === 'region') {
        if (value !== 'all') params.region = value;
      } else if (category === 'age') {
        if (value !== 'all') params.age = value;
      } else if (category === 'gender') {
        if (value !== 'all') params.gender = value;
      }

      // ======================
      // API 호출 (loanItemSrch)
      // ======================
      const response = await fetchLibrary.getPopularBooks(
        params.startDt,
        params.endDt,
        params.pageNo,
        params.pageSize,
        params.gender,
        params.age,
        params.region
      );

      // ======================
      //  응답 파싱
      // ======================
      let docs: any[] = [];
      if (response?.response?.docs) {
        const raw = response.response.docs;
        if (Array.isArray(raw)) docs = raw;
        else if (raw.doc) docs = Array.isArray(raw.doc) ? raw.doc : [raw.doc];
        else docs = [raw];
      }

      // ======================
      //  알라딘 데이터 merge
      // ======================
      const enriched = await Promise.all(
        docs.slice(0, 6).map(async (item: any, index: number) => {
          const doc = item.doc || item;
          const isbn13 = doc.isbn13 || '';
          let aladin: any = null;

          if (isbn13) {
            try {
              const res = await fetchAladin.getBookDetails(isbn13);
              const detail = res?.item?.[0];
              if (detail) {
                aladin = {
                  cover: detail.cover,
                  link: detail.link,
                  description: detail.description
                };
              }
            } catch (e) {
              //
            }
          }

          return {
            no: index + 1,
            ranking: doc.ranking ?? index + 1,
            bookname: doc.bookname || '제목 없음',
            authors: doc.authors || '저자 없음',
            isbn13,
            bookImageURL: aladin?.cover || doc.bookImageURL || '/images/no-image.png',
            bookDtlUrl: aladin?.link || doc.bookDtlUrl || '',
            loan_count: doc.loan_count ?? 0,
            class_no: doc.class_no || '',
            class_nm: doc.class_nm || ''
          };
        })
      );

      setBooks(enriched as Book[]);
    } catch (err) {
      setError('데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleFilterChange = (category: FilterCategory, value: string) => {
    // 선택 탭만 유지, 나머지는 all
    const next = { region: 'all', age: 'all', gender: 'all' } as Record<FilterCategory, string>;
    next[category] = value;

    setActiveFilter(next);
    setIsDropdownOpen(false); // 드랍다운 닫기
    fetchFilteredBooks(category, value);
  };

  const handleCategoryChange = (category: FilterCategory) => {
    setActiveCategory(category);
    setIsDropdownOpen(false);

    const nextFilter = {
      region: category === 'region' ? activeFilter.region : 'all',
      age: category === 'age' ? activeFilter.age : 'all',
      gender: category === 'gender' ? activeFilter.gender : 'all'
    };

    setActiveFilter(nextFilter);

    // 카테고리 변경 시 해당 카테고리의 "전체" 즉시 로드
    fetchFilteredBooks(category, 'all');
  };

  return (
    <section className={styles.popularLoanBooks}>
      <div className={styles.header}>
        <h1>인기 대출도서</h1>

        {/* 드랍다운 셀렉터 */}
        <div className={styles.dropdown}>
          <button className={styles.dropdownButton} onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
            {getCategoryName(activeCategory)} ▼
          </button>

          {isDropdownOpen && (
            <div className={styles.dropdownMenu}>
              <button
                onClick={() => handleCategoryChange('region')}
                className={activeCategory === 'region' ? styles.active : ''}>
                지역별
              </button>
              <button
                onClick={() => handleCategoryChange('age')}
                className={activeCategory === 'age' ? styles.active : ''}>
                연령별
              </button>
              <button
                onClick={() => handleCategoryChange('gender')}
                className={activeCategory === 'gender' ? styles.active : ''}>
                성별
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 하위 필터 */}
      <div className={styles.subTabs}>
        {getCurrentOptions().map((option) => (
          <button
            key={option.code}
            onClick={() => handleFilterChange(activeCategory, option.code)}
            className={`${styles.subTab} ${activeFilter[activeCategory] === option.code ? styles.active : ''}`}
            disabled={isLoading}>
            {option.name}
          </button>
        ))}
      </div>

      {/* 로딩 상태 */}
      {isLoading && (
        <div className={styles.loadingState}>
          <p>데이터를 불러오는 중...</p>
        </div>
      )}

      {/* 에러 상태 */}
      {error && (
        <div className={styles.errorState}>
          <p>{error}</p>
          <button
            onClick={() => fetchFilteredBooks(activeCategory, activeFilter[activeCategory])}
            className={styles.retryButton}>
            다시 시도
          </button>
        </div>
      )}

      {/* 도서 목록 - 가로 레이아웃 */}
      {!isLoading && !error && (
        <div className={styles.bookGrid}>
          {books.length > 0 ? (
            books.map((book, i) => (
              <div key={book.isbn13 || i} className={styles.bookItem}>
                {/* 순위 표시 */}
                <div className={styles.ranking}>
                  <span className={i < 3 ? styles.top3 : styles.normal}>{i + 1}</span>
                </div>

                {/* 책 표지 이미지 */}
                <div className={styles.bookCover}>
                  <img src={book.bookImageURL || '/images/no-image.png'} alt={book.bookname || '책 표지'} />
                </div>

                {/* 책 정보 */}
                <div className={styles.bookInfo}>
                  <h3 className={styles.bookTitle}>{formatBookTitle(book.bookname || '제목 없음')}</h3>
                  <p className={styles.bookAuthor}>{formatBookAuthor(book.authors || '저자 없음')}</p>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.emptyState}>
              <p>해당 조건의 인기 대출도서가 없습니다.</p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export default PopularLoanBooks;
