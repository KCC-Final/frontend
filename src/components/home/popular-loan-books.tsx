'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useCallback, useEffect } from 'react';

import styles from './popular-loan-books.module.scss';

import { fetchAladin } from '@/apis/aladin';
import { fetchLibrary } from '@/apis/library';
import BookCard from '@/components/common/book/book-card';
import { Book } from '@/types';
import { regionList } from '@/types/common/region'; // 지역 데이터 불러오기

// 필터 옵션 타입 정의
type FilterOption = {
  code: string;
  name: string;
  apiCode: string;
};

type FilterCategory = 'region' | 'age' | 'gender';

const REGION_NAME_MAP: Record<string, string> = {
  서울특별시: '서울',
  부산광역시: '부산',
  대구광역시: '대구',
  인천광역시: '인천',
  광주광역시: '광주',
  대전광역시: '대전',
  울산광역시: '울산',
  세종특별자치시: '세종',
  경기도: '경기',
  강원특별자치도: '강원',
  충청북도: '충북',
  충청남도: '충남',
  전북특별자치도: '전북',
  전라남도: '전남',
  경상북도: '경북',
  경상남도: '경남',
  제주특별자치도: '제주'
};

const REGION_OPTIONS: FilterOption[] = [
  { code: 'all', name: '전국', apiCode: 'all' },
  ...regionList.map((r) => ({
    code: r.code,
    name: REGION_NAME_MAP[r.name] || r.name, // 매핑 없으면 원본 그대로
    apiCode: r.code
  }))
];

// 모든 지역 코드 자동 생성
const ALL_REGION_CODES = regionList.map((r) => r.code);

// 연령 필터 옵션
const AGE_OPTIONS: FilterOption[] = [
  { code: 'all', name: '전체', apiCode: '' },
  { code: '0', name: '영유아(0~5세)', apiCode: '0' },
  { code: '6', name: '유아(6~7세)', apiCode: '6' },
  { code: '8', name: '초등(8~13세)', apiCode: '8' },
  { code: '14', name: '청소년(14~19세)', apiCode: '14' },
  { code: '20', name: '20대', apiCode: '20' },
  { code: '30', name: '30대', apiCode: '30' },
  { code: '40', name: '40대', apiCode: '40' },
  { code: '50', name: '50대', apiCode: '50' },
  { code: '60', name: '60세 이상', apiCode: '60' }
];

// 성별 필터 옵션
const GENDER_OPTIONS: FilterOption[] = [
  { code: 'all', name: '전체', apiCode: '' },
  { code: '0', name: '남성', apiCode: '0' },
  { code: '1', name: '여성', apiCode: '1' }
];

// 랜덤 선택 유틸
function getRandomItems<T>(array: T[], count: number): T[] {
  if (array.length <= count) return array;
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

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
    // initialBooks가 비어 있으면 전국 데이터 조회 실행
    if (!initialBooks || initialBooks.length === 0) {
      fetchFilteredBooks('region', 'all');
    } else {
      // 초기 도서 데이터를 한번 표시하고 최신화 위해 재조회
      setBooks(initialBooks);
      fetchFilteredBooks('region', 'all');
    }
  }, []); // 최초 한 번만 실행

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

  // --- 개별 지역 데이터 조회 ---
  const fetchSingleRegionData = async (
    regionCode: string,
    startDate: string,
    endDate: string,
    genderCode?: string,
    ageCode?: string
  ): Promise<any[]> => {
    try {
      console.log(`[지역 ${regionCode}] API 호출 시작`);

      const response = await fetchLibrary.getLoanItemsByLibOrRegion(
        undefined, // libCode
        regionCode, // region
        undefined, // dtl_region
        startDate,
        endDate,
        genderCode || undefined,
        ageCode || undefined,
        1,
        20
      );

      if (response?.response?.docs) {
        let docs: any[] = [];
        const raw = response.response.docs;

        if (Array.isArray(raw)) docs = raw;
        else if (raw.doc) docs = Array.isArray(raw.doc) ? raw.doc : [raw.doc];
        else docs = [raw];

        return docs.map((doc: any) => ({
          ...doc,
          regionCode,
          regionName: REGION_OPTIONS.find((r) => r.apiCode === regionCode)?.name || regionCode
        }));
      }

      console.warn(`[지역 ${regionCode}] 데이터 없음`);
      return [];
    } catch (error) {
      console.error(`[지역 ${regionCode}] API 호출 실패:`, error);
      return [];
    }
  };

  // --- 전국 데이터 조회 ---
  const fetchAllRegionsData = async (
    startDate: string,
    endDate: string,
    genderCode?: string,
    ageCode?: string
  ): Promise<any[]> => {
    const allBooks: any[] = [];

    for (const code of ALL_REGION_CODES) {
      const regionBooks = await fetchSingleRegionData(code, startDate, endDate, genderCode, ageCode);
      allBooks.push(...regionBooks);
      await new Promise((r) => setTimeout(r, 100)); // API 과부하 방지
    }

    console.log('[전국 데이터 수집 완료]', allBooks.length);
    return getRandomItems(allBooks, 10);
  };

  // --- 알라딘 상세 데이터 통합 ---
  const enrichBookWithAladinData = async (isbn13: string): Promise<any> => {
    try {
      const res = await fetchAladin.getBookDetails(isbn13);
      const bookDetail = res?.item?.[0];
      if (!bookDetail) return null;
      return {
        cover: bookDetail.cover,
        link: bookDetail.link,
        description: bookDetail.description
      };
    } catch (err) {
      console.error('[알라딘 API 오류]', err);
      return null;
    }
  };

  // --- 필터별 데이터 호출 ---
  const fetchFilteredBooks = useCallback(
    async (category: FilterCategory, value: string) => {
      setIsLoading(true);
      setError(null);

      try {
        // 최근 3개월 기간 계산
        const today = new Date();
        const endDate = today.toISOString().split('T')[0];
        const start = new Date();
        start.setMonth(today.getMonth() - 3);
        const startDate = start.toISOString().split('T')[0];

        // 필터 값 초기화
        let regionCode = '';
        let ageCode = '';
        let genderCode = '';

        // 선택된 탭(category)에 따라 한 종류만 값 세팅
        if (category === 'region') {
          // "전체"면 region="" 으로 보내야 전국 전체
          regionCode = value === 'all' ? '' : value;
          ageCode = '';
          genderCode = '';
        } else if (category === 'age') {
          // "전체"면 age="" 으로 보내야 전체 연령
          ageCode = value === 'all' ? '' : value;
          regionCode = '';
          genderCode = '';
        } else if (category === 'gender') {
          // "전체"면 gender="" 으로 보내야 전체 성별
          genderCode = value === 'all' ? '' : value;
          regionCode = '';
          ageCode = '';
        }

        console.log('[필터링 API 호출 파라미터]', {
          category,
          value,
          regionCode,
          ageCode,
          genderCode
        });

        // 데이터 요청 결과 담을 배열
        let docs: any[] = [];

        // 지역이 있으면 특정 지역만, 없으면 전국(모든 지역 순회)
        if (regionCode) {
          docs = await fetchSingleRegionData(regionCode, startDate, endDate, genderCode, ageCode);
        } else {
          docs = await fetchAllRegionsData(startDate, endDate, genderCode, ageCode);
        }

        // 알라딘 API로 상세데이터 병합
        const enriched = await Promise.all(
          docs.map(async (item: any, index: number) => {
            const doc = item.doc || item;
            const isbn13 = doc.isbn13 || '';
            let aladin: any = null;

            // ISBN이 있을 때만 알라딘 API 호출
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
                console.warn(`[알라딘 데이터 불러오기 실패: ${isbn13}]`, e);
              }
            }

            // 데이터 병합 후 리턴
            return {
              no: index + 1,
              ranking: doc.ranking || index + 1,
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

        // 상태 업데이트
        setBooks(enriched as Book[]);
      } catch (err) {
        console.error('[필터링 API 오류]', err);
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    },
    [activeFilter]
  );

  const handleFilterChange = (category: FilterCategory, value: string) => {
    // 선택한 기준만 값 유지, 나머지는 all로 강제
    const next = { region: 'all', age: 'all', gender: 'all' } as Record<FilterCategory, string>;
    next[category] = value;

    setActiveFilter(next);
    fetchFilteredBooks(category, value); // 바로 조회
  };

  const handleMainTabChange = (tab: FilterCategory) => {
    setActiveTab(tab);
    // 탭 전환 시, 해당 탭만 유지하고 나머지는 all로 리셋
    setActiveFilter((prev) => ({
      region: tab === 'region' ? prev.region : 'all',
      age: tab === 'age' ? prev.age : 'all',
      gender: tab === 'gender' ? prev.gender : 'all'
    }));
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
          <p>{activeFilter.region === 'all' ? '전국 데이터를 수집 중...' : '데이터를 불러오는 중...'}</p>
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
