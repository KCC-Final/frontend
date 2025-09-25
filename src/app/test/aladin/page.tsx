'use client';

import React, { useState } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://api.groo.site';
const TTB_KEY = process.env.NEXT_PUBLIC_ALADIN_TTBKEY;

type TabType = 'search' | 'bestseller' | 'detail';

export default function AladinTestPage() {
  const [query, setQuery] = useState('해리포터');
  const [result, setResult] = useState<any>(null);
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('search');

  // 🔎 검색
  const handleSearch = async () => {
    try {
      setLoading(true);
      setResult(null);
      setSelectedBook(null);

      const url = `${API_BASE}/api/aladin/ItemSearch.aspx?ttbkey=${TTB_KEY}&Query=${encodeURIComponent(
        query
      )}&QueryType=Title&MaxResults=10&start=1&SearchTarget=Book&output=js&Version=20131101`;

      const res = await fetch(url);
      if (!res.ok) throw new Error('검색 API 호출 실패');
      const data = await res.json();
      setResult(data);
      setActiveTab('search');
    } catch (err: any) {
      setResult({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  // 🏆 베스트셀러
  const handleBestsellers = async () => {
    try {
      setLoading(true);
      setResult(null);
      setSelectedBook(null);

      const url = `${API_BASE}/api/aladin/ItemList.aspx?ttbkey=${TTB_KEY}&QueryType=Bestseller&MaxResults=10&start=1&SearchTarget=Book&output=js&Version=20131101`;

      const res = await fetch(url);
      if (!res.ok) throw new Error('베스트셀러 API 호출 실패');
      const data = await res.json();
      setResult(data);
      setActiveTab('bestseller');
    } catch (err: any) {
      setResult({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  // 📖 상세 조회
  const handleDetail = async (isbn13: string) => {
    try {
      setLoading(true);
      setSelectedBook(null);

      const url = `${API_BASE}/api/aladin/ItemLookUp.aspx?ttbkey=${TTB_KEY}&itemIdType=ISBN13&ItemId=${isbn13}&output=js&Version=20131101`;

      const res = await fetch(url);
      if (!res.ok) throw new Error('상세 조회 API 호출 실패');
      const data = await res.json();
      setSelectedBook(data);
      setActiveTab('detail');
    } catch (err: any) {
      setSelectedBook({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>📚 알라딘 API 테스트</h1>

      {/* 검색창 + 버튼 */}
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="검색어 입력"
          style={{ padding: '0.5rem', marginRight: '1rem', width: '300px' }}
        />
        <button onClick={handleSearch} style={{ marginRight: '0.5rem' }}>
          🔍 검색
        </button>
        <button onClick={handleBestsellers}>🏆 베스트셀러</button>
      </div>

      {loading && <p>⏳ 로딩 중...</p>}

      {/* 탭 콘텐츠 */}
      {activeTab === 'search' && result?.item && (
        <div>
          <h2>🔎 검색 결과</h2>
          <ul>
            {result.item.map((book: any, idx: number) => (
              <li key={idx} style={{ margin: '0.5rem 0' }}>
                <button
                  type="button"
                  onClick={() => handleDetail(book.isbn13)}
                  style={{
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    textAlign: 'left',
                    width: '100%'
                  }}>
                  <img src={book.cover} alt={book.title} width={60} style={{ marginRight: '0.5rem' }} />
                  <span>
                    {book.title} - {book.author}
                    {console.log(book)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {activeTab === 'bestseller' && result?.item && (
        <div>
          <h2>🏆 베스트셀러</h2>
          <ul>
            {result.item.map((book: any, idx: number) => (
              <li key={idx} style={{ margin: '0.5rem 0' }}>
                <button
                  onClick={() => handleDetail(book.isbn13)}
                  className="flex items-center cursor-pointer"
                  style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left' }}>
                  <img src={book.cover} alt={book.title} width={60} style={{ marginRight: '0.5rem' }} />
                  <span>
                    {book.title} - {book.author}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {activeTab === 'detail' && selectedBook?.item && (
        <div
          style={{
            marginTop: '2rem',
            padding: '1rem',
            border: '1px solid #ccc',
            borderRadius: '8px',
            background: '#fafafa'
          }}>
          <h2>{selectedBook.item[0].title}</h2>
          <img src={selectedBook.item[0].cover} alt={selectedBook.item[0].title} />
          <p>
            <strong>저자:</strong> {selectedBook.item[0].author}
          </p>
          <p>
            <strong>출판사:</strong> {selectedBook.item[0].publisher}
          </p>
          <p>
            <strong>출간일:</strong> {selectedBook.item[0].pubDate}
          </p>
          <p>{selectedBook.item[0].description}</p>
        </div>
      )}
    </div>
  );
}
