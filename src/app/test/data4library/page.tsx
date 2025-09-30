'use client';

import React, { useState } from 'react';

import { fetchLibrary } from '@/apis';

export default function Data4LibraryTestPage() {
  const [query, setQuery] = useState('해리포터');
  const [isbn, setIsbn] = useState('9788936434267'); // 해리포터 ISBN 예시
  const [libCode, setLibCode] = useState('141321'); // 도서관 코드 예시
  const [region, setRegion] = useState('11'); // 서울 지역코드
  const [result, setResult] = useState<any>(null);

  return (
    <div style={{ padding: '2rem' }}>
      <h1> 도서관정보나루 API 종합 테스트</h1>

      {/* 입력 필드들 */}
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
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', // 반응형 그리드
          gap: '0.5rem',
          marginBottom: '2rem'
        }}>
        {/* 도서 관련 API */}

        <button type="button" onClick={async () => setResult(await fetchLibrary.searchBooks(query, 1, 5))}>
          (신규) 도서 검색
        </button>

        <button type="button" onClick={async () => setResult(await fetchLibrary.getBookDetail(isbn))}>
          (신규) 도서 상세조회
        </button>

        <button type="button" onClick={async () => setResult(await fetchLibrary.getBookKeywords(isbn))}>
          (신규) 도서 키워드
        </button>

        <button type="button" onClick={async () => setResult(await fetchLibrary.getBookUsageAnalysis(isbn))}>
          (신규) 도서 이용분석
        </button>

        <button
          type="button"
          onClick={async () => setResult(await fetchLibrary.getPopularBooks('20250901', '20250923', 1, 5))}>
          (신규) 인기 대출도서
        </button>

        <button
          type="button"
          onClick={async () => setResult(await fetchLibrary.getHotTrendBooks('2025-09-23'))}>
          (신규) 급상승 도서
        </button>

        <button
          type="button"
          onClick={async () => setResult(await fetchLibrary.getManiaRecommendBooks(isbn))}>
          (신규) 마니아 추천
        </button>

        <button
          type="button"
          onClick={async () => setResult(await fetchLibrary.getReaderRecommendBooks(isbn))}>
          (신규) 다독자 추천
        </button>

        <button type="button" onClick={async () => setResult(await fetchLibrary.getLibraries(1, 5, region))}>
          (신규) 도서관 조회
        </button>

        <button
          type="button"
          onClick={async () => setResult(await fetchLibrary.getLibraryIntegratedInfo(1, 3, region))}>
          (신규) 도서관 통합정보
        </button>

        <button
          type="button"
          onClick={async () => setResult(await fetchLibrary.getLibraryItems(libCode, 'ALL', 1, 5))}>
          (신규) 도서관별 장서
        </button>

        <button
          type="button"
          onClick={async () => setResult(await fetchLibrary.getLibrariesByBook(isbn, region, 1, 5))}>
          (신규) 소장 도서관
        </button>

        <button
          type="button"
          onClick={async () => setResult(await fetchLibrary.checkBookAvailability(libCode, isbn))}>
          (신규) 도서 소장여부
        </button>

        <button
          type="button"
          onClick={async () => setResult(await fetchLibrary.getLibraryUsageTrend(libCode, 'D'))}>
          (신규) 대출반납추이
        </button>

        <button type="button" onClick={async () => setResult(await fetchLibrary.getNewArrivalBooks(libCode))}>
          (신규) 신착도서
        </button>

        <button
          type="button"
          onClick={async () => setResult(await fetchLibrary.getMonthlyKeywords('2025-09'))}>
          (신규) 이달의 키워드
        </button>

        <button
          type="button"
          onClick={async () => setResult(await fetchLibrary.getRegionalReadingStats(region, '2024'))}>
          (신규) 지역별 독서통계
        </button>
      </div>

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
