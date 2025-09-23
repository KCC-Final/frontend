'use client';

import React, { useState } from 'react';

import {
  searchBooks,
  getPopularBooks,
  getBookDetail,
  getLibraries,
  getHotTrendBooks,
  getLibraryItems,
  getManiaRecommendBooks,
  getReaderRecommendBooks,
  getLibrariesByBook,
  checkBookAvailability,
  getLibraryUsageTrend,
  getBookKeywords,
  getBookUsageAnalysis,
  getLibraryIntegratedInfo,
  getMonthlyKeywords,
  getRegionalReadingStats,
  getNewArrivalBooks
} from '@/api/data4library';

export default function Data4LibraryTestPage() {
  const [query, setQuery] = useState('해리포터');
  const [isbn, setIsbn] = useState('9788936434267'); // 해리포터 ISBN 예시
  const [libCode, setLibCode] = useState('141321'); // 도서관 코드 예시
  const [region, setRegion] = useState('11'); // 서울 지역코드
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleAPICall = async (apiFunction: () => Promise<any>, description: string) => {
    try {
      setLoading(true);
      setResult(null);
      console.log(` ${description} API 호출 시작`);

      const data = await apiFunction();
      setResult(data);
      console.log(` ${description} API 성공:`, data);
    } catch (err: any) {
      console.error(` ${description} API 에러:`, err);
      setResult({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1> 도서관정보나루 API 종합 테스트</h1>

      {/* 입력 필드들 - htmlFor 속성 추가로 접근성 개선 */}
      <div
        style={{
          marginBottom: '2rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '1rem'
        }}>
        <div>
          <label htmlFor="search-query">검색어:</label>
          <input
            id="search-query"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ padding: '0.5rem', width: '100%' }}
            placeholder="도서 검색어를 입력하세요"
          />
        </div>
        <div>
          <label htmlFor="isbn-input">ISBN:</label>
          <input
            id="isbn-input"
            type="text"
            value={isbn}
            onChange={(e) => setIsbn(e.target.value)}
            style={{ padding: '0.5rem', width: '100%' }}
            placeholder="13자리 ISBN을 입력하세요"
          />
        </div>
        <div>
          <label htmlFor="lib-code-input">도서관코드:</label>
          <input
            id="lib-code-input"
            type="text"
            value={libCode}
            onChange={(e) => setLibCode(e.target.value)}
            style={{ padding: '0.5rem', width: '100%' }}
            placeholder="도서관 코드를 입력하세요"
          />
        </div>
        <div>
          <label htmlFor="region-input">지역코드:</label>
          <input
            id="region-input"
            type="text"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            style={{ padding: '0.5rem', width: '100%' }}
            placeholder="지역 코드를 입력하세요 (11: 서울)"
          />
        </div>
      </div>

      {/* API 테스트 버튼들 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0.5rem',
          marginBottom: '2rem'
        }}>
        {/* 도서 관련 API */}
        <button
          type="button"
          onClick={() => handleAPICall(() => searchBooks(query, 1, 5), '도서 검색')}
          disabled={loading}>
          도서 검색
        </button>

        <button
          type="button"
          onClick={() => handleAPICall(() => getBookDetail(isbn), '도서 상세조회')}
          disabled={loading}>
          도서 상세조회
        </button>

        <button
          type="button"
          onClick={() => handleAPICall(() => getBookKeywords(isbn), '도서 키워드')}
          disabled={loading}>
          도서 키워드
        </button>

        <button
          type="button"
          onClick={() => handleAPICall(() => getBookUsageAnalysis(isbn), '도서 이용분석')}
          disabled={loading}>
          도서 이용분석
        </button>

        {/* 인기/추천 도서 API */}
        <button
          type="button"
          onClick={() =>
            handleAPICall(() => getPopularBooks('20250901', '20250923', 1, 5), '인기 대출도서')
          }
          disabled={loading}>
          인기 대출도서
        </button>

        <button
          type="button"
          onClick={() => handleAPICall(() => getHotTrendBooks('2025-09-23'), '급상승 도서')}
          disabled={loading}>
          급상승 도서
        </button>

        <button
          type="button"
          onClick={() => handleAPICall(() => getManiaRecommendBooks(isbn), '마니아 추천')}
          disabled={loading}>
          마니아 추천
        </button>

        <button
          type="button"
          onClick={() => handleAPICall(() => getReaderRecommendBooks(isbn), '다독자 추천')}
          disabled={loading}>
          다독자 추천
        </button>

        {/* 도서관 관련 API */}
        <button
          type="button"
          onClick={() => handleAPICall(() => getLibraries(1, 5, region), '도서관 조회')}
          disabled={loading}>
          도서관 조회
        </button>

        <button
          type="button"
          onClick={() =>
            handleAPICall(() => getLibraryIntegratedInfo(1, 3, region), '도서관 통합정보')
          }
          disabled={loading}>
          도서관 통합정보
        </button>

        <button
          type="button"
          onClick={() =>
            handleAPICall(() => getLibraryItems(libCode, 'ALL', 1, 5), '도서관별 장서')
          }
          disabled={loading}>
          도서관별 장서
        </button>

        <button
          type="button"
          onClick={() => handleAPICall(() => getLibrariesByBook(isbn, region, 1, 5), '소장 도서관')}
          disabled={loading}>
          소장 도서관
        </button>

        <button
          type="button"
          onClick={() => handleAPICall(() => checkBookAvailability(libCode, isbn), '도서 소장여부')}
          disabled={loading}>
          도서 소장여부
        </button>

        <button
          type="button"
          onClick={() => handleAPICall(() => getLibraryUsageTrend(libCode, 'D'), '대출반납추이')}
          disabled={loading}>
          대출반납추이
        </button>

        <button
          type="button"
          onClick={() => handleAPICall(() => getNewArrivalBooks(libCode), '신착도서')}
          disabled={loading}>
          신착도서
        </button>

        {/* 통계 관련 API */}
        <button
          type="button"
          onClick={() => handleAPICall(() => getMonthlyKeywords('2025-09'), '이달의 키워드')}
          disabled={loading}>
          이달의 키워드
        </button>

        <button
          type="button"
          onClick={() =>
            handleAPICall(() => getRegionalReadingStats(region, '2024'), '지역별 독서통계')
          }
          disabled={loading}>
          지역별 독서통계
        </button>
      </div>

      {loading && <p>⏳ 로딩 중...</p>}

      {/* 결과 JSON 출력 */}
      {result && (
        <div>
          <h3> API 응답 결과:</h3>
          <pre
            style={{
              background: '#f5f5f5',
              padding: '1rem',
              borderRadius: '8px',
              maxHeight: '500px',
              overflow: 'auto',
              fontSize: '12px'
            }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
