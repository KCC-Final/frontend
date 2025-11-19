'use client';

import { BookOpen, Search, User, MessageSquare, FileText } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

import { fetchAladin, fetchGroo } from '@/apis';
import PageLoading from '@/components/common/loading';
import UserProfileImage from '@/components/common/profile/image';
import styles from '@/components/search/search.module.scss';
import { AladinBookDetailsItem } from '@/types/aladin';
import { SearchResultItem } from '@/types/search';
import { getSearchErrorMessage } from '@/utils/error/search-error-handler';

type SearchTab = 'all' | 'users' | 'reviews' | 'comments' | 'books';

interface SearchResults {
  users: SearchResultItem[];
  reviews: SearchResultItem[];
  comments: SearchResultItem[];
  books: AladinBookDetailsItem[];
}

export default function IntegratedSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryParam = searchParams.get('q') || '';

  const [activeTab, setActiveTab] = useState<SearchTab>('all');
  const [keyword, setKeyword] = useState(queryParam);

  const [results, setResults] = useState<SearchResults>({
    users: [],
    reviews: [],
    comments: [],
    books: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (queryParam) {
      setKeyword(queryParam);
      performSearch(queryParam, activeTab);
    }
  }, [queryParam, activeTab]);

  const performSearch = async (searchKeyword: string, tab: SearchTab) => {
    if (!searchKeyword.trim()) {
      setResults({ users: [], reviews: [], comments: [], books: [] });
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (tab === 'all') {
        // 통합 검색: 모든 카테고리 동시 검색
        const [grooResponse, aladinResponse] = await Promise.allSettled([
          fetchGroo.search.searchAll(searchKeyword),
          fetchAladin.searchBooks(searchKeyword, 20)
        ]);

        const grooData =
          grooResponse.status === 'fulfilled' && grooResponse.value?.data ? grooResponse.value.data : [];

        const aladinData =
          aladinResponse.status === 'fulfilled' && aladinResponse.value?.item
            ? aladinResponse.value.item
            : [];

        const categorizedResults: SearchResults = {
          users: grooData.filter((item) => item.category === 'USER'),
          reviews: grooData.filter((item) => item.category === 'REVIEW'),
          comments: grooData.filter((item) => item.category === 'COMMENT'),
          books: aladinData
        };

        setResults(categorizedResults);
      } else if (tab === 'books') {
        // 도서 검색만
        const response = await fetchAladin.searchBooks(searchKeyword, 20);
        setResults({
          users: [],
          reviews: [],
          comments: [],
          books: response?.item && Array.isArray(response.item) ? response.item : []
        });
      } else {
        // 특정 카테고리 검색 (users, reviews, comments)
        const response = await fetchGroo.search.searchAll(searchKeyword);
        const grooData = response?.data || [];

        const categoryMap: Record<string, 'USER' | 'REVIEW' | 'COMMENT'> = {
          users: 'USER',
          reviews: 'REVIEW',
          comments: 'COMMENT'
        };

        const category = categoryMap[tab];
        const filteredData = grooData.filter((item) => item.category === category);

        setResults({
          users: tab === 'users' ? filteredData : [],
          reviews: tab === 'reviews' ? filteredData : [],
          comments: tab === 'comments' ? filteredData : [],
          books: []
        });
      }
    } catch (error: any) {
      const errorMessage = getSearchErrorMessage(error);
      setError(errorMessage);
      setResults({ users: [], reviews: [], comments: [], books: [] });
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

  const handleTabChange = (tab: SearchTab) => {
    setActiveTab(tab);
    if (keyword.trim()) {
      performSearch(keyword, tab);
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

  const getTotalCount = () => {
    return results.users.length + results.reviews.length + results.comments.length + results.books.length;
  };

  const hasResults = (category: keyof SearchResults) => {
    return results[category].length > 0;
  };

  const getCategoryTabLabel = (tab: SearchTab): string => {
    switch (tab) {
      case 'all':
        return '통합 검색';
      case 'users':
        return '사용자';
      case 'reviews':
        return '독후감';
      case 'comments':
        return '댓글';
      case 'books':
        return '도서';
      default:
        return '';
    }
  };

  const getCategoryTabIcon = (tab: SearchTab) => {
    switch (tab) {
      case 'all':
        return <Search size={18} />;
      case 'users':
        return <User size={18} />;
      case 'reviews':
        return <FileText size={18} />;
      case 'comments':
        return <MessageSquare size={18} />;
      case 'books':
        return <BookOpen size={18} />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.search_section}>
        <h1 className={styles.title}>검색</h1>

        {/* 탭 선택 */}
        <div className={styles.tab_buttons}>
          {(['all', 'users', 'reviews', 'comments', 'books'] as SearchTab[]).map((tab) => (
            <button
              key={tab}
              className={`${styles.tab_button} ${activeTab === tab ? styles.active : ''}`}
              onClick={() => handleTabChange(tab)}>
              {getCategoryTabIcon(tab)}
              {getCategoryTabLabel(tab)}
            </button>
          ))}
        </div>

        <form className={styles.search_form} onSubmit={handleSearch}>
          <div className={styles.search_input_wrapper}>
            <Search className={styles.search_icon} size={20} />
            <input
              type="text"
              className={styles.search_input}
              placeholder={
                activeTab === 'all'
                  ? '사용자, 독후감, 댓글, 도서를 검색하세요'
                  : activeTab === 'books'
                    ? '도서 제목 또는 저자를 검색하세요'
                    : `${getCategoryTabLabel(activeTab)}을(를) 검색하세요`
              }
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
          <button type="submit" className={styles.search_button}>
            검색
          </button>
        </form>
      </div>

      {/* 로딩 */}
      {loading && <PageLoading />}

      {/* 에러 */}
      {error && !loading && (
        <div className={styles.error}>
          <p>{error}</p>
        </div>
      )}

      {/* 통합 검색 결과 */}
      {activeTab === 'all' && !loading && !error && (
        <div className={styles.results_section}>
          {getTotalCount() === 0 && queryParam && (
            <div className={styles.empty}>
              <p>검색 결과가 없습니다</p>
            </div>
          )}

          {getTotalCount() > 0 && (
            <div className={styles.results_container}>
              <p className={styles.results_count}>
                이 <strong>{getTotalCount()}</strong>개의 검색 결과
              </p>

              {/* 사용자 결과 (최대 5개) */}
              {hasResults('users') && (
                <div className={styles.category_section}>
                  <div className={styles.category_header}>
                    <h2 className={styles.category_title} style={{ color: getCategoryColor('USER') }}>
                      사용자 ({results.users.length})
                    </h2>
                    {results.users.length > 8 && (
                      <button className={styles.view_all_button} onClick={() => handleTabChange('users')}>
                        전체보기
                      </button>
                    )}
                  </div>

                  <div className={styles.results_list}>
                    {results.users.slice(0, 5).map((item, index) => (
                      <Link
                        key={`user-${item.id}-${index}`}
                        href={getResultLink(item)}
                        className={styles.result_card}>
                        <div className={styles.card_header}>
                          <span
                            className={styles.category_badge}
                            style={{ backgroundColor: getCategoryColor(item.category) }}>
                            {getCategoryLabel(item.category)}
                          </span>
                        </div>
                        <div className={styles.user_info}>
                          <UserProfileImage userId={item.id} profileImage={null} size={48} />
                          <div className={styles.user_details}>
                            <h3 className={styles.result_title}>{item.title}</h3>
                            <p className={styles.result_subtext}>{item.subtext}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* 독후감 결과 (최대 5개) */}
              {hasResults('reviews') && (
                <div className={styles.category_section}>
                  <div className={styles.category_header}>
                    <h2 className={styles.category_title} style={{ color: getCategoryColor('REVIEW') }}>
                      독후감 ({results.reviews.length})
                    </h2>
                    {results.reviews.length > 5 && (
                      <button className={styles.view_all_button} onClick={() => handleTabChange('reviews')}>
                        전체보기
                      </button>
                    )}
                  </div>

                  <div className={styles.results_list}>
                    {results.reviews.slice(0, 5).map((item, index) => (
                      <Link
                        key={`review-${item.id}-${index}`}
                        href={getResultLink(item)}
                        className={styles.result_card}>
                        <div className={styles.card_header}>
                          <span
                            className={styles.category_badge}
                            style={{ backgroundColor: getCategoryColor(item.category) }}>
                            {getCategoryLabel(item.category)}
                          </span>
                        </div>
                        <h3 className={styles.result_title}>{item.title}</h3>
                        {item.subtext && <p className={styles.result_subtext}>{item.subtext}</p>}
                        {item.content && <p className={styles.result_content}>{item.content}</p>}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* 댓글 결과 (최대 5개) */}
              {hasResults('comments') && (
                <div className={styles.category_section}>
                  <div className={styles.category_header}>
                    <h2 className={styles.category_title} style={{ color: getCategoryColor('COMMENT') }}>
                      댓글 ({results.comments.length})
                    </h2>
                    {results.comments.length > 5 && (
                      <button className={styles.view_all_button} onClick={() => handleTabChange('comments')}>
                        전체보기
                      </button>
                    )}
                  </div>

                  <div className={styles.results_list}>
                    {results.comments.slice(0, 5).map((item, index) => (
                      <Link
                        key={`comment-${item.id}-${index}`}
                        href={getResultLink(item)}
                        className={styles.result_card}>
                        <div className={styles.card_header}>
                          <span
                            className={styles.category_badge}
                            style={{ backgroundColor: getCategoryColor(item.category) }}>
                            {getCategoryLabel(item.category)}
                          </span>
                        </div>
                        <h3 className={styles.result_title}>{item.title}</h3>
                        {item.subtext && <p className={styles.result_subtext}>{item.subtext}</p>}
                        {item.content && <p className={styles.result_content}>{item.content}</p>}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* 도서 결과 (최대 5개) */}
              {hasResults('books') && (
                <div className={styles.category_section}>
                  <div className={styles.category_header}>
                    <h2 className={styles.category_title} style={{ color: '#2563eb' }}>
                      도서 ({results.books.length})
                    </h2>
                    {results.books.length > 8 && (
                      <button className={styles.view_all_button} onClick={() => handleTabChange('books')}>
                        전체보기
                      </button>
                    )}
                  </div>

                  <div className={styles.book_results_grid}>
                    {results.books.slice(0, 8).map((book) => (
                      <Link key={book.isbn13} href={`/books/${book.isbn13}`} className={styles.book_card}>
                        <div className={styles.book_cover}>
                          <Image
                            src={book.cover || '/images/no-image.png'}
                            alt={book.title}
                            width={120}
                            height={174}
                            className={styles.cover_image}
                          />
                        </div>
                        <div className={styles.book_info}>
                          <h3 className={styles.book_title}>{book.title}</h3>
                          <p className={styles.book_author}>{book.author}</p>
                          <p className={styles.book_publisher}>
                            {book.publisher} · {book.pubDate}
                          </p>
                          {book.description && <p className={styles.book_description}>{book.description}</p>}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 사용자 탭 */}
      {activeTab === 'users' && !loading && !error && (
        <div className={styles.results_section}>
          {results.users.length === 0 && queryParam ? (
            <div className={styles.empty}>
              <p>검색 결과가 존재하지않습니다.</p>
            </div>
          ) : (
            <div className={styles.results_container}>
              <p className={styles.results_count}>
                이 <strong>{results.users.length}</strong>개의 사용자
              </p>
              <div className={styles.results_list}>
                {results.users.map((item, index) => (
                  <Link
                    key={`user-${item.id}-${index}`}
                    href={getResultLink(item)}
                    className={styles.result_card}>
                    <div className={styles.card_header}>
                      <span
                        className={styles.category_badge}
                        style={{ backgroundColor: getCategoryColor(item.category) }}>
                        {getCategoryLabel(item.category)}
                      </span>
                    </div>
                    <div className={styles.user_info}>
                      <UserProfileImage userId={item.id} profileImage={null} size={48} />
                      <div className={styles.user_details}>
                        <h3 className={styles.result_title}>{item.title}</h3>
                        <p className={styles.result_subtext}>{item.subtext}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 독후감 탭 */}
      {activeTab === 'reviews' && !loading && !error && (
        <div className={styles.results_section}>
          {results.reviews.length === 0 && queryParam ? (
            <div className={styles.empty}>
              <p>검색 결과가 존재하지않습니다.</p>
            </div>
          ) : (
            <div className={styles.results_container}>
              <p className={styles.results_count}>
                이 <strong>{results.reviews.length}</strong>개의 독후감
              </p>
              <div className={styles.results_list}>
                {results.reviews.map((item, index) => (
                  <Link
                    key={`review-${item.id}-${index}`}
                    href={getResultLink(item)}
                    className={styles.result_card}>
                    <div className={styles.card_header}>
                      <span
                        className={styles.category_badge}
                        style={{ backgroundColor: getCategoryColor(item.category) }}>
                        {getCategoryLabel(item.category)}
                      </span>
                    </div>
                    <h3 className={styles.result_title}>{item.title}</h3>
                    {item.subtext && <p className={styles.result_subtext}>{item.subtext}</p>}
                    {item.content && <p className={styles.result_content}>{item.content}</p>}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 댓글 탭 */}
      {activeTab === 'comments' && !loading && !error && (
        <div className={styles.results_section}>
          {results.comments.length === 0 && queryParam ? (
            <div className={styles.empty}>
              <p>검색 결과가 존재하지않습니다.</p>
            </div>
          ) : (
            <div className={styles.results_container}>
              <p className={styles.results_count}>
                이 <strong>{results.comments.length}</strong>개의 댓글
              </p>
              <div className={styles.results_list}>
                {results.comments.map((item, index) => (
                  <Link
                    key={`comment-${item.id}-${index}`}
                    href={getResultLink(item)}
                    className={styles.result_card}>
                    <div className={styles.card_header}>
                      <span
                        className={styles.category_badge}
                        style={{ backgroundColor: getCategoryColor(item.category) }}>
                        {getCategoryLabel(item.category)}
                      </span>
                    </div>
                    <h3 className={styles.result_title}>{item.title}</h3>
                    {item.subtext && <p className={styles.result_subtext}>{item.subtext}</p>}
                    {item.content && <p className={styles.result_content}>{item.content}</p>}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 도서 탭 */}
      {activeTab === 'books' && !loading && !error && (
        <div className={styles.results_section}>
          {results.books.length === 0 && queryParam ? (
            <div className={styles.empty}>
              <p>검색 결과가 존재하지않습니다.</p>
            </div>
          ) : (
            <div className={styles.results_container}>
              <p className={styles.results_count}>
                이 <strong>{results.books.length}</strong>개의 도서
              </p>
              <div className={styles.book_results_grid}>
                {results.books.map((book) => (
                  <Link key={book.isbn13} href={`/books/${book.isbn13}`} className={styles.book_card}>
                    <div className={styles.book_cover}>
                      <Image
                        src={book.cover || '/images/no-image.png'}
                        alt={book.title}
                        width={120}
                        height={174}
                        className={styles.cover_image}
                      />
                    </div>
                    <div className={styles.book_info}>
                      <h3 className={styles.book_title}>{book.title}</h3>
                      <p className={styles.book_author}>{book.author}</p>
                      <p className={styles.book_publisher}>
                        {book.publisher} · {book.pubDate}
                      </p>
                      {book.description && <p className={styles.book_description}>{book.description}</p>}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
