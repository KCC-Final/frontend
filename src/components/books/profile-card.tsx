'use client';

import { Bookmark, BookOpen, Plus } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

import { fetchGroo } from '@/apis';
import styles from '@/components/books/profile-card.module.scss';
import { AladinBookDetailsItem } from '@/types';
import { formatBookAuthor, formatBookTitle } from '@/utils/format/string';

interface BookProfileCardProps {
  bookInfo: AladinBookDetailsItem;
}

function BookProfileCard({ bookInfo }: BookProfileCardProps) {
  const router = useRouter();
  const [isScraped, setIsScraped] = useState(false);
  const [isCheckingScrap, setIsCheckingScrap] = useState(true);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showScrapManagement, setShowScrapManagement] = useState(false);
  const [bookshelves, setBookshelves] = useState<Array<{ bookshelfId: number; name: string }>>([]);
  const [selectedBookshelf, setSelectedBookshelf] = useState<{ bookshelfId: number; name: string } | null>(
    null
  );
  const [newBookshelfName, setNewBookshelfName] = useState('');
  const [showCreateInput, setShowCreateInput] = useState(false);
  const [isCreatingBookshelf, setIsCreatingBookshelf] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const ratingPercentage = (bookInfo.customerReviewRank / 10) * 100;

  useEffect(() => {
    fetchBookshelves();
    checkIfScraped();
  }, [bookInfo.isbn13]);

  useEffect(() => {
    if (showCreateInput) inputRef.current?.focus();
  }, [showCreateInput]);

  const fetchBookshelves = async () => {
    try {
      const data = await fetchGroo.bookshelf.getBookshelfList();
      setBookshelves(data);
    } catch (error) {
      console.error('책장 목록 조회 실패:', error);
    }
  };

  const checkIfScraped = async () => {
    setIsCheckingScrap(true);
    try {
      const shelves = await fetchGroo.bookshelf.getBookshelfList();

      for (const shelf of shelves) {
        try {
          const scrap = await fetchGroo.bookshelf.getBookScrap(shelf.bookshelfId, bookInfo.isbn13);

          if (scrap) {
            setIsScraped(true);
            setSelectedBookshelf(shelf);
            setShowScrapManagement(true);
            return;
          }
        } catch (error) {
          continue;
        }
      }

      setIsScraped(false);
      setSelectedBookshelf(null);
      setShowScrapManagement(false);
    } catch (error) {
      console.error('스크랩 확인 실패:', error);
      setIsScraped(false);
      setSelectedBookshelf(null);
      setShowScrapManagement(false);
    } finally {
      setIsCheckingScrap(false);
    }
  };

  const handleScrap = async () => {
    if (isScraped && selectedBookshelf) {
      if (confirm('스크랩을 제거하시겠습니까?')) {
        try {
          const { bookshelf } = await import('@/apis/groo/bookshelf');

          await fetchGroo.bookshelf.deleteBookScrap(selectedBookshelf.bookshelfId, bookInfo.isbn13);

          setIsScraped(false);
          setShowScrapManagement(false);
          setSelectedBookshelf(null);

          alert('스크랩이 제거되었습니다.');
        } catch (error: any) {
          console.error('스크랩 제거 실패:', error);
          alert(`스크랩 제거에 실패했습니다. ${error.response?.data?.message || error.message}`);
        }
      }
    } else {
      setShowCategoryModal(true);
    }
  };

  const handleCategorySelect = async (bookshelfId: number, name: string) => {
    try {
      // 수정: 백엔드 DTO 형식에 맞게 대문자 ISBN 사용
      const requestData = {
        bookshelfId: bookshelfId,
        ISBN: bookInfo.isbn13 // 대문자 ISBN
      };

      await fetchGroo.bookshelf.createBookScrap(requestData);

      setShowCategoryModal(false);
      await checkIfScraped();

      alert('스크랩되었습니다.');
    } catch (error: any) {
      if (error.response?.data?.message?.includes('already exists')) {
        alert('이미 해당 책장에 스크랩된 도서입니다.');
        await checkIfScraped();
      } else {
        alert('스크랩에 실패했습니다.');
      }
    }
  };

  // 수정: 카테고리 변경 로직 - 백엔드 응답 직접 활용
  const handleChangeCategory = async (bookshelfId: number, name: string) => {
    if (!selectedBookshelf) return;

    // 같은 카테고리 클릭 시 무시
    if (selectedBookshelf.bookshelfId === bookshelfId) {
      setShowCategoryModal(false);
      return;
    }

    if (!confirm(`카테고리를 '${selectedBookshelf.name}'에서 '${name}'(으)로 변경하시겠습니까?`)) {
      return;
    }

    try {
      // 1단계: 기존 책장에서 삭제
      await fetchGroo.bookshelf.deleteBookScrap(selectedBookshelf.bookshelfId, bookInfo.isbn13);

      // 2단계: 새 책장에 추가
      const newScrap = await fetchGroo.bookshelf.createBookScrap({
        bookshelfId: bookshelfId,
        ISBN: bookInfo.isbn13
      });

      // 해결: 백엔드 응답을 기반으로 상태 즉시 업데이트 (DB 데이터 확정)
      setIsScraped(true);
      setSelectedBookshelf({ bookshelfId, name });
      setShowScrapManagement(true);
      setShowCategoryModal(false);

      alert('카테고리가 변경되었습니다.');
    } catch (error: any) {
      alert(`카테고리 변경에 실패했습니다. ${error.response?.data?.message || error.message}`);

      // 실패 시에만 상태 재확인
      await checkIfScraped();
    }
  };
  const handleWriteReview = () => {
    router.push(`/reviews/write?isbn=${bookInfo.isbn13}&from=/books/${bookInfo.isbn13}`);
  };

  const handleCreateBookshelf = async () => {
    if (!newBookshelfName.trim()) {
      alert('책장 이름을 입력해주세요.');
      return;
    }

    setIsCreatingBookshelf(true);
    try {
      const newShelf = await fetchGroo.bookshelf.createBookshelf({ name: newBookshelfName.trim() });

      // 새로 만든 책장에 바로 스크랩
      if (isScraped && selectedBookshelf) {
        await handleChangeCategory(newShelf.bookshelfId, newShelf.name);
      } else {
        await handleCategorySelect(newShelf.bookshelfId, newShelf.name);
      }

      await fetchBookshelves();
      setNewBookshelfName('');
      setShowCreateInput(false);
    } catch (error) {
      console.error('책장 생성 실패:', error);
      alert('책장 생성에 실패했습니다.');
    } finally {
      setIsCreatingBookshelf(false);
    }
  };

  return (
    <>
      <section className={styles.book_card}>
        <div
          className={styles.cover}
          style={{ '--background-image': `url(${bookInfo.cover})` } as React.CSSProperties}>
          <Image className={styles.img} src={bookInfo.cover} alt={bookInfo.title} width={160} height={240} />
        </div>
        <div className={styles.info}>
          <div className={styles.header}>
            <div className={styles.category}>{bookInfo.categoryName}</div>
            <div className={styles.title}>{formatBookTitle(bookInfo.title)}</div>
          </div>
          <div className={styles.content}>
            <div className={styles.book}>
              <div className={styles.author}>
                <span>저자</span>
                <span>{formatBookAuthor(bookInfo.author)}</span>
              </div>
              <div className={styles.date}>
                <span>출간일</span>
                <span>{bookInfo.pubDate}</span>
              </div>
              <div className={styles.rank}>
                <span>평점</span>
                <div className={styles.rating_display}>
                  <div className={styles.stars}>
                    <div className={styles.background}>★★★★★</div>
                    <div className={styles.fill} style={{ width: `${ratingPercentage}%` }}>
                      ★★★★★
                    </div>
                  </div>
                  <span className={styles.score_text}>{(bookInfo.customerReviewRank / 2).toFixed(1)}</span>
                </div>
              </div>
            </div>
            <div className={styles.groo}>
              <div className={styles.review}>
                <span>독후감</span>
                <span>
                  <span>
                    <BookOpen size="18px" color="#333333" />
                  </span>
                  <span>{'1,243'}</span>
                </span>
              </div>
              <div className={styles.scrap}>
                <span>스크랩</span>
                <span>
                  <span>
                    <Bookmark size="18px" color="#333333" />
                  </span>
                  <span>{'2,287'}</span>
                </span>
              </div>
            </div>
          </div>
          <span className={styles.divider} />
          <div className={styles.description}>
            <span>책소개</span>
            <p>{bookInfo.description}</p>
          </div>

          <div className={styles.action_buttons}>
            <button
              onClick={handleScrap}
              disabled={isCheckingScrap}
              className={`${styles.action_button} ${isScraped ? styles.scraped : ''}`}>
              <Bookmark size={18} fill={isScraped ? 'currentColor' : 'none'} />
              {isCheckingScrap ? '확인 중...' : isScraped ? '스크랩 완료' : '스크랩하기'}
            </button>
            <button onClick={handleWriteReview} className={styles.action_button}>
              <BookOpen size={18} />
              독후감 쓰기
            </button>
          </div>
        </div>
      </section>

      {showScrapManagement && selectedBookshelf && (
        <section className={styles.scrap_management}>
          <div className={styles.scrap_info}>
            <Bookmark size={18} color="#007664" fill="#007664" />
            <span className={styles.scrap_status}>스크랩된 도서</span>
            <span className={styles.scrap_category}>• {selectedBookshelf.name}</span>
          </div>
          <div className={styles.scrap_actions}>
            <button onClick={() => setShowCategoryModal(true)} className={styles.category_button}>
              카테고리 수정
            </button>
          </div>
        </section>
      )}

      {showCategoryModal && (
        <div className={styles.modal_overlay} onClick={() => setShowCategoryModal(false)}>
          <div className={styles.modal_content} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modal_title}>{isScraped ? '카테고리 수정' : '카테고리 선택'}</h3>

            <div className={styles.modal_body}>
              <div className={styles.select_section}>
                <h4 className={styles.section_title}>책장 선택</h4>

                <div className={styles.category_list}>
                  {bookshelves.length > 0 ? (
                    bookshelves.map((shelf) => (
                      <button
                        key={shelf.bookshelfId}
                        onClick={() => {
                          if (isScraped) {
                            handleChangeCategory(shelf.bookshelfId, shelf.name);
                          } else {
                            handleCategorySelect(shelf.bookshelfId, shelf.name);
                          }
                        }}
                        className={`${styles.category_item} ${
                          selectedBookshelf?.bookshelfId === shelf.bookshelfId ? styles.active : ''
                        }`}>
                        {shelf.name}
                      </button>
                    ))
                  ) : (
                    <p className={styles.empty_message}>생성된 책장이 없습니다.</p>
                  )}
                </div>
              </div>
            </div>

            {/*  새 책장 만들기 + 취소 버튼을 같은 줄에 배치 */}
            <div className={styles.modal_actions}>
              <button className={styles.create_shelf_button} onClick={() => setShowCreateInput(true)}>
                <Plus size={18} />새 책장 만들기
              </button>

              <button
                className={styles.cancel_button}
                onClick={() => {
                  setShowCategoryModal(false);
                  setShowCreateInput(false);
                  setNewBookshelfName('');
                }}>
                취소
              </button>
            </div>

            {/*  새 책장 입력창 */}
            {showCreateInput && (
              <div className={styles.create_input_group}>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="책장 이름을 입력하세요"
                  value={newBookshelfName}
                  onChange={(e) => setNewBookshelfName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleCreateBookshelf();
                  }}
                  className={styles.create_input}
                  disabled={isCreatingBookshelf}
                />
                <button
                  onClick={handleCreateBookshelf}
                  className={styles.create_button}
                  disabled={isCreatingBookshelf || !newBookshelfName.trim()}>
                  {isCreatingBookshelf ? '생성 중...' : '생성'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default BookProfileCard;
