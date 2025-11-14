'use client';

import { Search, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { useShallow } from 'zustand/shallow';

import { fetchAladin, fetchGroo } from '@/apis';
import styles from '@/components/common/layout/header/header.module.scss';
import UserProfileImage from '@/components/common/profile/image';
import NotificationBell from '@/components/notification/bell';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import useBoundStore from '@/stores';
import { SearchResultItem } from '@/types/search';
import { devLogger } from '@/utils/dev-logger';

function RightNavigation() {
  const router = useRouter();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const { myInfo, setMyInfo } = useBoundStore(
    useShallow((state) => ({ myInfo: state.myInfo, setMyInfo: state.setMyInfo }))
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (searchKeyword.trim()) {
        performSearch(searchKeyword.trim());
      } else {
        setSearchResults([]);
        setShowSearchResults(false);
      }
    }, 300);

    return () => clearTimeout(delaySearch);
  }, [searchKeyword]);

  const performSearch = async (keyword: string) => {
    try {
      setIsSearching(true);

      // 동시에 두 API 요청 (Groo + Aladin)
      const [grooRes, aladinRes] = await Promise.allSettled([
        fetchGroo.search.searchAll(keyword),
        fetchAladin.searchBooks(keyword, 5) // 도서 미리보기 5개만
      ]);

      const grooResults = grooRes.status === 'fulfilled' && grooRes.value?.data ? grooRes.value.data : [];

      const aladinBooks =
        aladinRes.status === 'fulfilled' && aladinRes.value?.item
          ? aladinRes.value.item.map((book: any) => ({
              id: book.isbn13,
              title: book.title,
              subtext: book.author,
              category: 'BOOK',
              cover: book.cover
            }))
          : [];

      // Groo + Book 통합 (앞부분에 사용자/리뷰/댓글, 뒷부분에 도서)
      const combined = [...grooResults.slice(0, 3), ...aladinBooks.slice(0, 2)];
      setSearchResults(combined);
      setShowSearchResults(true);
    } catch (error) {
      devLogger('검색 실패');
      devLogger(error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchKeyword.trim())}`);
      setShowSearchResults(false);
      setSearchKeyword('');
    }
  };

  const handleResultClick = (item: SearchResultItem) => {
    setShowSearchResults(false);
    setSearchKeyword('');

    switch (item.category) {
      case 'USER':
        router.push(`/users/${item.id}`);
        break;
      case 'REVIEW':
        router.push(`/reviews/${item.id}`);
        break;
      case 'COMMENT':
        router.push(`/reviews/${item.id}`);
        break;

      // 도서 상세 이동 추가
      case 'BOOK':
        router.push(`/books/${item.id}`);
        break;

      default:
        break;
    }
  };

  const clearSearch = () => {
    setSearchKeyword('');
    setSearchResults([]);
    setShowSearchResults(false);
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

  const routePageHandler = (url: string) => () => {
    router.push(url);
  };

  const logoutHandler = async () => {
    try {
      await fetchGroo.auth.logout();
      setMyInfo(null);
      router.push('/login');
    } catch (error) {
      devLogger('로그아웃 실패');
      devLogger(error);
    }
  };

  return (
    <nav className={styles.function}>
      <div className={styles.search_container} ref={searchRef}>
        <form className={styles.search} onSubmit={handleSearchSubmit}>
          <input
            type="text"
            className={styles.search_input}
            placeholder="검색어를 입력하세요"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onFocus={() => searchKeyword && setShowSearchResults(true)}
          />
          {searchKeyword && (
            <button
              type="button"
              className={styles.search_clear}
              onClick={clearSearch}
              aria-label="검색어 지우기">
              <X size={16} />
            </button>
          )}
          <button type="submit" className={styles.search_button} aria-label="검색">
            <Search size={20} color="#333333" />
          </button>
        </form>

        {showSearchResults && (
          <div className={styles.search_results}>
            {isSearching && <div className={styles.search_loading}>검색 중...</div>}

            {!isSearching && searchResults.length === 0 && (
              <div className={styles.search_empty}>검색 결과가 없습니다</div>
            )}

            {!isSearching && searchResults.length > 0 && (
              <>
                <div className={styles.results_list}>
                  {searchResults.map((item, index) => (
                    <button
                      key={`${item.category}-${item.id}-${index}`}
                      className={styles.result_item}
                      onClick={() => handleResultClick(item)}>
                      <span
                        className={styles.result_badge}
                        style={{ backgroundColor: getCategoryColor(item.category) }}>
                        {getCategoryLabel(item.category)}
                      </span>
                      <div className={styles.result_content}>
                        <p className={styles.result_title}>{item.title}</p>
                        {item.subtext && <p className={styles.result_subtext}>{item.subtext}</p>}
                      </div>
                    </button>
                  ))}
                </div>
                <Link
                  href={`/search?q=${encodeURIComponent(searchKeyword)}`}
                  className={styles.show_all_button}
                  onClick={() => setShowSearchResults(false)}>
                  모든 결과 보기
                </Link>
              </>
            )}
          </div>
        )}
      </div>

      <div className={styles.user}>
        <NotificationBell />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className={styles.user_avatar_button}>
              {myInfo ? (
                <UserProfileImage userId={myInfo.userId} profileImage={myInfo.profileImage} size={38} />
              ) : (
                <UserProfileImage userId={''} profileImage={null} size={38} />
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[12rem]">
            {myInfo ? (
              <DropdownMenuItem
                className="text-[1.4rem] px-[1rem] py-[0.8rem]"
                onClick={routePageHandler(`/users/${myInfo.userId}`)}>
                내 피드
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                className="text-[1.4rem] px-[1rem] py-[0.8rem]"
                onClick={routePageHandler(`/users/`)}>
                내 피드
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              className="text-[1.4rem] px-[1rem] py-[0.8rem]"
              onClick={routePageHandler('/my-bookshelf')}>
              내 책장
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-[1.4rem] px-[1rem] py-[0.8rem]"
              onClick={routePageHandler('/my-activities')}>
              내 활동
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-[1.4rem] px-[1rem] py-[0.8rem]"
              onClick={routePageHandler('/my-info')}>
              계정 설정
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-[1.4rem] px-[1rem] py-[0.8rem]">
              <button onClick={logoutHandler}>로그아웃</button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}

export default RightNavigation;
