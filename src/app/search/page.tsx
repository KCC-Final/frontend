'use client';

import { Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

import styles from './page.module.scss';

import { fetchGroo } from '@/apis';
import UserProfileImage from '@/components/common/profile/image';
import { SearchResultItem } from '@/types/search';
import { getSearchErrorMessage } from '@/utils/error/search-error-handler';

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryParam = searchParams.get('q') || '';

  const [keyword, setKeyword] = useState(queryParam);
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (queryParam) {
      performSearch(queryParam);
    }
  }, [queryParam]);

  const performSearch = async (searchKeyword: string) => {
    if (!searchKeyword.trim()) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await fetchGroo.search.searchAll(searchKeyword);

      if (response && response.data) {
        setResults(response.data);
      } else {
        setResults([]);
      }
    } catch (error: any) {
      const errorMessage = getSearchErrorMessage(error);
      setError(errorMessage);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword.trim()) {
      router.push(`/search?q=${encodeURIComponent(keyword.trim())}`);
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'USER':
        return '사용자';
      case 'REVIEW':
        return '독후감';
      case 'COMMENT':
        return '댓글';
      default:
        return category;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'USER':
        return '#007664';
      case 'REVIEW':
        return '#d97706';
      case 'COMMENT':
        return '#7c3aed';
      default:
        return '#6b7280';
    }
  };

  const getResultLink = (item: SearchResultItem) => {
    switch (item.category) {
      case 'USER':
        return `/users/${item.id}`;
      case 'REVIEW':
        return `/reviews/${item.id}`;
      case 'COMMENT':
        return `/reviews/${item.id}`;
      default:
        return '#';
    }
  };

  const groupedResults = results.reduce(
    (acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    },
    {} as Record<string, SearchResultItem[]>
  );

  return (
    <div className={styles.container}>
      <div className={styles.search_section}>
        <h1 className={styles.title}>검색</h1>
        <form className={styles.search_form} onSubmit={handleSearch}>
          <div className={styles.search_input_wrapper}>
            <Search className={styles.search_icon} size={20} />
            <input
              type="text"
              className={styles.search_input}
              placeholder="사용자, 독후감, 댓글을 검색하세요"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
          <button type="submit" className={styles.search_button}>
            검색
          </button>
        </form>
      </div>

      <div className={styles.results_section}>
        {loading && (
          <div className={styles.loading}>
            <p>검색 중입니다...</p>
          </div>
        )}

        {error && (
          <div className={styles.error}>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && results.length === 0 && queryParam && (
          <div className={styles.empty}>
            <p>검색 결과가 없습니다</p>
          </div>
        )}

        {!loading && !error && results.length > 0 && (
          <div className={styles.results_container}>
            <p className={styles.results_count}>
              총 <strong>{results.length}</strong>개의 검색 결과
            </p>

            {Object.entries(groupedResults).map(([category, items]) => (
              <div key={category} className={styles.category_section}>
                <h2 className={styles.category_title} style={{ color: getCategoryColor(category) }}>
                  {getCategoryLabel(category)} ({items.length})
                </h2>

                <div className={styles.results_list}>
                  {items.map((item, index) => (
                    <Link
                      key={`${item.category}-${item.id}-${index}`}
                      href={getResultLink(item)}
                      className={styles.result_card}>
                      <div className={styles.card_header}>
                        <span
                          className={styles.category_badge}
                          style={{ backgroundColor: getCategoryColor(item.category) }}>
                          {getCategoryLabel(item.category)}
                        </span>
                      </div>

                      {item.category === 'USER' && (
                        <div className={styles.user_info}>
                          <UserProfileImage userId={item.id} profileImage={null} size={48} />
                          <div className={styles.user_details}>
                            <h3 className={styles.result_title}>{item.title}</h3>
                            <p className={styles.result_subtext}>{item.subtext}</p>
                          </div>
                        </div>
                      )}

                      {item.category !== 'USER' && (
                        <>
                          <h3 className={styles.result_title}>{item.title}</h3>
                          {item.subtext && <p className={styles.result_subtext}>{item.subtext}</p>}
                          {item.content && <p className={styles.result_content}>{item.content}</p>}
                        </>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
