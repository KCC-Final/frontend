'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useCallback } from 'react';

import styles from './popular-loan-books.module.scss';

import { fetchAladin } from '@/apis/aladin';
import { fetchLibrary } from '@/apis/library';
import { Book } from '@/types';

type FilterOption = {
  code: string;
  name: string;
  apiCode: string;
};

type FilterCategory = 'region' | 'age' | 'gender';

const REGION_OPTIONS: FilterOption[] = [
  { code: 'all', name: '전국', apiCode: 'all' }, // 전국은 모든 지역 호출
  { code: '11', name: '서울', apiCode: '11' },
  { code: '21', name: '부산', apiCode: '21' },
  { code: '22', name: '대구', apiCode: '22' },
  { code: '23', name: '인천', apiCode: '23' },
  { code: '24', name: '광주', apiCode: '24' },
  { code: '25', name: '대전', apiCode: '25' },
  { code: '26', name: '울산', apiCode: '26' },
  { code: '29', name: '세종', apiCode: '29' },
  { code: '31', name: '경기', apiCode: '31' },
  { code: '32', name: '강원', apiCode: '32' },
  { code: '33', name: '충북', apiCode: '33' },
  { code: '34', name: '충남', apiCode: '34' },
  { code: '35', name: '전북', apiCode: '35' },
  { code: '36', name: '전남', apiCode: '36' },
  { code: '37', name: '경북', apiCode: '37' },
  { code: '38', name: '경남', apiCode: '38' },
  { code: '39', name: '제주', apiCode: '39' }
];

const ALL_REGION_CODES = [
  '11',
  '21',
  '22',
  '23',
  '24',
  '25',
  '26',
  '29',
  '31',
  '32',
  '33',
  '34',
  '35',
  '36',
  '37',
  '38',
  '39'
];

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

const GENDER_OPTIONS: FilterOption[] = [
  { code: 'all', name: '전체', apiCode: '' },
  { code: '0', name: '남성', apiCode: '0' },
  { code: '1', name: '여성', apiCode: '1' }
];

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
        genderCode || undefined, // gender
        ageCode || undefined, // age
        1, // pageNo
        20 // pageSize
      );

      console.log(`[지역 ${regionCode}] API 전체 응답:`, response);

      // 응답 구조 확인 및 데이터 추출
      let docs = [];

      if (response?.response?.docs) {
        console.log(
          `[지역 ${regionCode}] docs 타입:`,
          typeof response.response.docs,
          Array.isArray(response.response.docs)
        );
        console.log(`[지역 ${regionCode}] docs 내용:`, response.response.docs);

        // docs가 배열인 경우
        if (Array.isArray(response.response.docs)) {
          docs = response.response.docs;
          console.log(`[지역 ${regionCode}] docs 배열: ${docs.length}개`);
        }
        // docs.doc가 있는 경우
        else if (response.response.docs.doc) {
          docs = Array.isArray(response.response.docs.doc)
            ? response.response.docs.doc
            : [response.response.docs.doc];
          console.log(`[지역 ${regionCode}] docs.doc: ${docs.length}개`);
        }
        // docs 자체가 객체인 경우
        else {
          docs = [response.response.docs];
          console.log(`[지역 ${regionCode}] docs 객체: 1개`);
        }

        if (docs.length > 0) {
          console.log(`[지역 ${regionCode}] 첫 번째 도서 샘플:`, docs[0]);

          return docs.map((doc: any) => ({
            ...doc,
            regionCode,
            regionName: REGION_OPTIONS.find((r) => r.apiCode === regionCode)?.name || regionCode
          }));
        }
      }

      console.log(`[지역 ${regionCode}] 데이터 없음`);
      return [];
    } catch (error) {
      console.error(`[지역 ${regionCode}] API 호출 실패:`, error);
      return [];
    }
  };

  const fetchAllRegionsData = async (
    startDate: string,
    endDate: string,
    genderCode?: string,
    ageCode?: string
  ): Promise<any[]> => {
    console.log('[전국 데이터 호출] 모든 지역 순차 호출 시작');

    const allBooks: any[] = [];
    let successCount = 0;
    let errorCount = 0;

    // 모든 지역을 순차적으로 호출 (병렬 호출시 API 제한 가능성)
    for (const regionCode of ALL_REGION_CODES) {
      try {
        const regionBooks = await fetchSingleRegionData(regionCode, startDate, endDate, genderCode, ageCode);

        if (regionBooks.length > 0) {
          allBooks.push(...regionBooks);
          successCount++;
          console.log(`[전국 수집] ${regionCode}: ${regionBooks.length}개 추가 (누적: ${allBooks.length}개)`);
        }

        // API 제한 방지를 위한 짧은 지연
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (error) {
        errorCount++;
        console.error(`[전국 수집] ${regionCode} 실패:`, error);
      }
    }

    console.log('[전국 데이터 호출] 완료', {
      totalRegions: ALL_REGION_CODES.length,
      successRegions: successCount,
      errorRegions: errorCount,
      totalBooks: allBooks.length
    });

    // 랜덤하게 10개 선택
    const randomBooks = getRandomItems(allBooks, 10);

    console.log('[전국 데이터 랜덤 선택] 완료', {
      totalBooks: allBooks.length,
      selectedBooks: randomBooks.length
    });

    return randomBooks;
  };

  const enrichBookWithAladinData = async (isbn13: string): Promise<any> => {
    try {
      console.log(`[알라딘 API] ISBN ${isbn13} 상세정보 요청`);
      const aladinData = await fetchAladin.getBookDetails(isbn13);

      if (aladinData?.item && aladinData.item.length > 0) {
        const bookDetail = aladinData.item[0];
        console.log(`[알라딘 API] ISBN ${isbn13} 데이터 수신 완료`);
        return {
          cover: bookDetail.cover,
          description: bookDetail.description,
          priceSales: bookDetail.priceSales,
          priceStandard: bookDetail.priceStandard,
          customerReviewRank: bookDetail.customerReviewRank,
          link: bookDetail.link,
          subInfo: bookDetail.subInfo
        };
      }
    } catch (error) {
      console.error(`[알라딘 API] ISBN ${isbn13} 요청 실패:`, error);
    }
    return null;
  };

  const fetchFilteredBooks = useCallback(
    async (category: FilterCategory, value: string) => {
      setIsLoading(true);
      setError(null);

      try {
        // 최근 1개월 기간 계산
        const today = new Date();
        const endDate = today.toISOString().split('T')[0];
        const startDate = new Date(today.setMonth(today.getMonth() - 1)).toISOString().split('T')[0];

        let regionCode = '';
        let ageCode = '';
        let genderCode = '';

        // 선택된 필터값 매핑
        if (category === 'region') {
          // '전체' 선택 시 undefined로 넘겨서 API에서 자동으로 전국/전체로 처리
          const regionOption = REGION_OPTIONS.find((f) => f.code === activeFilter.region);
          regionCode = regionOption?.code === 'all' ? undefined : regionOption?.apiCode;
        } else if (category === 'age') {
          const option = AGE_OPTIONS.find((f) => f.code === value);
          ageCode = option?.apiCode || '';
          const regionOption = REGION_OPTIONS.find((f) => f.code === activeFilter.region);
          regionCode = regionOption?.apiCode || '';
          const genderOption = GENDER_OPTIONS.find((f) => f.code === activeFilter.gender);
          genderCode = genderOption?.apiCode || '';
        } else if (category === 'gender') {
          const option = GENDER_OPTIONS.find((f) => f.code === value);
          genderCode = option?.apiCode || '';
          const regionOption = REGION_OPTIONS.find((f) => f.code === activeFilter.region);
          regionCode = regionOption?.apiCode || '';
          const ageOption = AGE_OPTIONS.find((f) => f.code === activeFilter.age);
          ageCode = ageOption?.apiCode || '';
        }

        console.log('[필터링 API 호출]', { category, value, regionCode, ageCode, genderCode });

        let docs: any[] = [];

        // --- 케이스 1: 성별/연령만 선택 시 (region 생략) ---
        if (!regionCode && (ageCode || genderCode)) {
          console.log('[전국 기준 - 성별/연령 조건 조회]');
          const response = await fetchLibrary.getLoanItemsByLibOrRegion(
            undefined, // libCode
            undefined, // region
            undefined, // dtl_region
            startDate,
            endDate,
            genderCode || undefined,
            ageCode || undefined,
            1,
            20
          );

          if (response?.response?.docs?.doc) {
            const allDocs = Array.isArray(response.response.docs.doc)
              ? response.response.docs.doc
              : [response.response.docs.doc];
            docs = getRandomItems(allDocs, 10);
          }

          // --- 케이스 2: 지역 전체 (전체 버튼) ---
        } else if (regionCode === '') {
          console.log('[전국 지역 전체 순차 호출]');
          docs = await fetchAllRegionsData(startDate, endDate, genderCode, ageCode);

          // --- 케이스 3: 특정 지역 선택 ---
        } else {
          console.log(`[특정 지역 조회] region=${regionCode}`);
          const regionData = await fetchSingleRegionData(regionCode, startDate, endDate, genderCode, ageCode);
          docs = getRandomItems(regionData, 10);
        }

        // --- 데이터 변환 및 알라딘 정보 통합 ---
        console.log('[데이터 변환 시작] 알라딘 API로 상세정보 추가');

        const enrichedDocsPromises = docs.map(async (item: any, index: number) => {
          const doc = item.doc || item;
          const isbn13 = doc.isbn13 || '';

          // 알라딘 API로 상세정보 가져오기
          const aladinData = isbn13 ? await enrichBookWithAladinData(isbn13) : null;

          return {
            doc,
            aladinData,
            index
          };
        });

        const enrichedDocs = await Promise.all(enrichedDocsPromises);

        const newBooks: Book[] = enrichedDocs.map(({ doc, aladinData, index }) => {
          return {
            no: doc.no || index + 1,
            ranking: doc.ranking || index + 1,
            bookname: doc.bookname || '제목 없음',
            authors: doc.authors || '저자 없음',
            publisher: doc.publisher || '출판사 없음',
            publication_year: doc.publication_year || doc.pub_year || '',
            isbn13: doc.isbn13 || '',
            addition_symbol: doc.addition_symbol || '',
            vol: doc.vol || '',
            class_no: doc.class_no || '',
            class_nm: doc.class_nm || '',
            // 알라딘 표지 이미지 우선 사용, 없으면 정보나루 이미지 사용
            bookImageURL: aladinData?.cover || doc.bookImageURL || '/images/no-image.png',
            bookDtlUrl: aladinData?.link || doc.bookDtlUrl || '',
            loan_count: doc.loan_count || 0
          };
        });

        console.log('[필터링 완료]', `${newBooks.length}개 도서 변환 완료 (알라딘 정보 통합)`);
        setBooks(newBooks);
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
    const newFilter = { ...activeFilter, [category]: value };
    setActiveFilter(newFilter);
    fetchFilteredBooks(category, value);
  };

  return (
    <section className={styles.popularLoanBooks}>
      <div className={styles.container}>
        {/* 헤더 */}
        <div className={styles.header}>
          <h2>인기 대출도서 (랜덤 10권)</h2>
        </div>

        {/* 메인 탭 */}
        <div className={styles.mainTabs}>
          <button
            onClick={() => setActiveTab('region')}
            className={`${styles.mainTab} ${activeTab === 'region' ? styles.active : ''}`}>
            지역별
          </button>
          <button
            onClick={() => setActiveTab('age')}
            className={`${styles.mainTab} ${activeTab === 'age' ? styles.active : ''}`}>
            연령별
          </button>
          <button
            onClick={() => setActiveTab('gender')}
            className={`${styles.mainTab} ${activeTab === 'gender' ? styles.active : ''}`}>
            성별
          </button>
        </div>

        {/* 서브 탭 */}
        <div className={styles.subTabs}>
          {getCurrentOptions().map((option) => (
            <button
              key={option.code}
              onClick={() => handleFilterChange(activeTab, option.code)}
              className={`${styles.subTab} ${activeFilter[activeTab] === option.code ? styles.active : ''}`}
              disabled={isLoading}>
              {option.name}
              {option.code === 'all' && activeTab === 'region' && (
                <span className={styles.allIndicator}> (전체지역)</span>
              )}
            </button>
          ))}
        </div>

        {/* 로딩 상태 */}
        {isLoading && (
          <div className={styles.loadingState}>
            <p>
              {activeFilter.region === 'all'
                ? '전국 17개 지역 데이터를 수집하는 중...'
                : '데이터를 불러오는 중...'}
            </p>
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

        {/* 도서 그리드 */}
        {!isLoading && !error && (
          <div className={styles.bookGrid}>
            {books.length > 0 ? (
              books.map((book, index) => (
                <Link
                  key={`${book.isbn13 || index}-${index}`}
                  href={`/books/${book.isbn13 || 'no-isbn'}`}
                  className={styles.bookItem}>
                  {/* 랭킹 숫자 */}
                  <div className={styles.ranking}>
                    <span className={index < 3 ? styles.top3 : styles.normal}>{index + 1}</span>
                  </div>

                  {/* 도서 표지 */}
                  <div className={styles.bookCover}>
                    <Image
                      src={book.bookImageURL || '/images/no-image.png'}
                      alt={book.bookname}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                    />
                  </div>

                  {/* 도서 정보 */}
                  <div className={styles.bookInfo}>
                    <h3>{book.bookname}</h3>
                    <p className={styles.author}>{book.authors}</p>
                    <p className={styles.publisher}>{book.publisher}</p>

                    {/* 대출 건수 */}
                    {book.loan_count && <p className={styles.loanCount}>대출 {book.loan_count}회</p>}
                  </div>
                </Link>
              ))
            ) : (
              <div className={styles.emptyState}>
                <p>해당 조건의 인기 대출도서가 없습니다.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default PopularLoanBooks;
