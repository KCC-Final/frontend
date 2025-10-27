'use client';

import React, { useState } from 'react';

import { fetchNLLibrary } from '@/apis/nl-library';
import { LibrarianRecommendBook, CATEGORY_CODE_MAP, CategoryCode } from '@/types/nl-library';

export default function TestNLLibrary() {
  const [books, setBooks] = useState<LibrarianRecommendBook[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const [params, setParams] = useState({
    startRowNumApi: 1,
    endRowNumApi: 10,
    start_date: '',
    end_date: '',
    drCode: '' as CategoryCode | ''
  });

  const handleFetch = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchNLLibrary.getLibrarianRecommendBooks(
        params.startRowNumApi,
        params.endRowNumApi,
        params.start_date || undefined,
        params.end_date || undefined,
        params.drCode || undefined
      );

      const items = Array.isArray(response.channel?.list)
        ? response.channel.list.map((entry: any) => entry.item)
        : response.channel?.list?.item
          ? [response.channel.list.item]
          : [];

      setBooks(items);
      setTotalCount(Number(response.channel?.totalCount ?? 0));
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">국립중앙도서관 사서 추천도서 API 테스트</h1>

        {/* 파라미터 입력 폼 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">API 파라미터</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                type="number"
                value={params.startRowNumApi}
                onChange={(e) => setParams({ ...params, startRowNumApi: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <input
                type="number"
                value={params.endRowNumApi}
                onChange={(e) => setParams({ ...params, endRowNumApi: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <input
                type="text"
                value={params.start_date}
                onChange={(e) => setParams({ ...params, start_date: e.target.value })}
                placeholder="20240101"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <input
                type="text"
                value={params.end_date}
                onChange={(e) => setParams({ ...params, end_date: e.target.value })}
                placeholder="20241231"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <select
                value={params.drCode}
                onChange={(e) => setParams({ ...params, drCode: e.target.value as CategoryCode | '' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">전체</option>
                <option value="11">문학</option>
                <option value="6">인문과학</option>
                <option value="5">사회과학</option>
                <option value="4">자연과학</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleFetch}
            disabled={loading}
            className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors">
            {loading ? '로딩 중...' : '조회하기'}
          </button>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 font-medium">에러 발생</p>
            <p className="text-red-600 text-sm mt-1">{error}</p>
          </div>
        )}

        {/* 결과 통계 */}
        {totalCount > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-800 font-medium">총 {totalCount}건의 사서 추천도서가 있습니다.</p>
            <p className="text-blue-600 text-sm mt-1">현재 {books.length}건을 표시하고 있습니다.</p>
          </div>
        )}

        {/* 도서 목록 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <div
              key={book.recomNo}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden">
              {book.recomfilepath && (
                <img
                  src={book.recomfilepath}
                  alt={book.recomtitle}
                  className="w-full h-64 object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/300x400?text=No+Image';
                  }}
                />
              )}

              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-800">
                    {book.drCodeName}
                  </span>
                  <span className="text-xs text-gray-500">
                    {book.recomYear}년 {book.recomMonth}월
                  </span>
                </div>

                <h3 className="font-bold text-lg mb-2 line-clamp-2 text-gray-900">{book.recomtitle}</h3>

                <p className="text-sm text-gray-600 mb-1">{book.recomauthor}</p>

                <p className="text-sm text-gray-500 mb-2">{book.recompublisher}</p>

                {book.publishYear && <p className="text-xs text-gray-400">출판년도: {book.publishYear}</p>}

                {book.recomisbn && <p className="text-xs text-gray-400 mt-1">ISBN: {book.recomisbn}</p>}
              </div>
            </div>
          ))}
        </div>

        {books.length === 0 && !loading && !error && (
          <div className="text-center py-12 text-gray-500">
            조회 버튼을 눌러 사서 추천도서를 확인해보세요.
          </div>
        )}
      </div>
    </div>
  );
}
