'use client';

import { useState, useCallback, useEffect } from 'react';

import styles from './popular-loan-books.module.scss';

import { fetchAladin } from '@/apis/aladin';
import { fetchLibrary } from '@/apis/library';
import BookCard from '@/components/common/book/book-card';
import { Book } from '@/types';
import { REGION_OPTIONS, AGE_OPTIONS, GENDER_OPTIONS } from '@/types/common/library_code';

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
  const [activeTab, setActiveTab] = useState<FilterCategory>('region');
  const [activeFilter, setActiveFilter] = useState({
    region: 'all',
    age: 'all',
    gender: 'all'
  });
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 페이지 로드시 자동 데이터 로드
  useEffect(() => {
    if (!initialBooks || initialBooks.length === 0) {
      fetchFilteredBooks('region', 'all');
    } else {
      setBooks(initialBooks);
    }
  }, []);

  // 현재 탭에 따른 옵션 리스트 반환
  const getCurrentOptions = (): FilterOption[] => {
    switch (activeTab) {
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

  // --- 필터별 데이터 호출 (최적화) ---
  const fetchFilteredBooks = useCallback(async (category: FilterCategory, value: string) => {
    setIsLoading(true);
    setError(null);

    console.log(' [fetchFilteredBooks 호출]', { category, value });

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
        pageSize: 21,
        format: 'json'
      };

      // ======================
      // 필터 조건 (단일 선택 전용)
      // ======================
      if (category === 'region') {
        // 지역 전체 → region 없음 / 특정 지역만 설정
        if (value !== 'all') params.region = value;
      } else if (category === 'age') {
        // 연령 전체 → 없음 / 특정 연령만 코드로 전달
        if (value !== 'all') params.age = value;
      } else if (category === 'gender') {
        // 성별 전체 → 없음 / 특정 성별만 코드로 전달
        if (value !== 'all') params.gender = value;
      }

      console.log(' [요청 파라미터 설정 완료]', params);

      // ======================
      // API 호출 (loanItemSrch)
      // ======================
      console.log(' [API 호출 시작] /loanItemSrch');
      const response = await fetchLibrary.getPopularBooks(
        params.startDt,
        params.endDt,
        params.pageNo,
        params.pageSize,
        params.gender,
        params.age,
        params.region
      );

      console.log(' [API 응답 수신]', response);

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

      console.log(` [파싱 완료] 총 ${docs.length}권`, docs.slice(0, 3));

      // ======================
      //  알라딘 데이터 merge
      // ======================
      const enriched = await Promise.all(
        docs.slice(0, 21).map(async (item: any, index: number) => {
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
              console.warn(`[ 알라딘 실패 ${isbn13}]`, e);
            }
          }

          return {
            no: index + 1,
            ranking: doc.ranking ?? index + 1,
            bookname: doc.bookname || '제목 없음',
            authors: doc.authors || '저자 없음',
            publisher: doc.publisher || '출판사 없음',
            publication_year: doc.publication_year || doc.pub_year || '',
            isbn13,
            bookImageURL: aladin?.cover || doc.bookImageURL || '/images/no-image.png',
            bookDtlUrl: aladin?.link || doc.bookDtlUrl || '',
            loan_count: doc.loan_count ?? 0,
            class_no: doc.class_no || '',
            class_nm: doc.class_nm || ''
          };
        })
      );

      console.log(` [병합 완료] 최종 ${enriched.length}권`, enriched.slice(0, 3));
      setBooks(enriched as Book[]);
    } catch (err) {
      console.error(' [필터링 API 오류]', err);
      setError('데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
      console.log(' [fetchFilteredBooks 종료]');
    }
  }, []);

  const handleFilterChange = (category: FilterCategory, value: string) => {
    // 선택 탭만 유지, 나머지는 all
    const next = { region: 'all', age: 'all', gender: 'all' } as Record<FilterCategory, string>;
    next[category] = value;

    setActiveFilter(next);
    fetchFilteredBooks(category, value);
  };

  const handleMainTabChange = (tab: FilterCategory) => {
    setActiveTab(tab);

    const nextFilter = {
      region: tab === 'region' ? activeFilter.region : 'all',
      age: tab === 'age' ? activeFilter.age : 'all',
      gender: tab === 'gender' ? activeFilter.gender : 'all'
    };

    setActiveFilter(nextFilter);

    //  탭 바뀌면 해당 탭의 "전체" 즉시 로드
    fetchFilteredBooks(tab, 'all');
  };

  return (
    <section className={styles.popularLoanBooks}>
      <h1>인기 대출도서</h1>

      {/* 상단 탭 */}
      <div className={styles.mainTabs}>
        {['region', 'age', 'gender'].map((cat) => (
          <button
            key={cat}
            onClick={() => handleMainTabChange(cat as FilterCategory)}
            className={`${styles.mainTab} ${activeTab === cat ? styles.active : ''}`}>
            {cat === 'region' ? '지역별' : cat === 'age' ? '연령별' : '성별'}
          </button>
        ))}
      </div>

      {/* 하위 필터 */}
      <div className={styles.subTabs}>
        {getCurrentOptions().map((option) => (
          <button
            key={option.code}
            onClick={() => handleFilterChange(activeTab, option.code)}
            className={`${styles.subTab} ${activeFilter[activeTab] === option.code ? styles.active : ''}`}
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
            onClick={() => fetchFilteredBooks(activeTab, activeFilter[activeTab])}
            className={styles.retryButton}>
            다시 시도
          </button>
        </div>
      )}

      {/* 도서 목록 */}
      {!isLoading && !error && (
        <div className={styles.bookGrid}>
          {books.length > 0 ? (
            books.map((book, i) => (
              <div key={book.isbn13 || i} className={styles.bookItem}>
                {/* 순위 표시 */}
                <div className={styles.ranking}>
                  <span className={i < 3 ? styles.top3 : styles.normal}>{i + 1}</span>
                </div>

                {/* 도서 카드 */}
                <BookCard
                  isbn={book.isbn13 || ''}
                  title={book.bookname || '제목 없음'}
                  author={book.authors || '저자 없음'}
                  cover={book.bookImageURL || '/images/no-image.png'}
                  publisher={book.publisher || ''}
                />
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
