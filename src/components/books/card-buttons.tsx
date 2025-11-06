'use client';

import { Bookmark, BookOpen, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

import { fetchGroo } from '@/apis';
import styles from '@/components/books/card-buttons.module.scss';

interface BookProfileCardButtonsProps {
  isbn: string;
}

function BookProfileCardButtons({ isbn }: BookProfileCardButtonsProps) {
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

  useEffect(() => {
    fetchBookshelves();
    checkIfScraped();
  }, [isbn]);

  useEffect(() => {
    if (showCreateInput) inputRef.current?.focus();
  }, [showCreateInput]);

  const fetchBookshelves = async () => {
    try {
      const data = await fetchGroo.bookshelf.getBookshelfList();
      setBookshelves(data);
    } catch {}
  };

  const checkIfScraped = async () => {
    setIsCheckingScrap(true);
    try {
      const shelves = await fetchGroo.bookshelf.getBookshelfList();
      for (const shelf of shelves) {
        try {
          const scrap = await fetchGroo.bookshelf.getBookScrap(shelf.bookshelfId, isbn);
          if (scrap) {
            setIsScraped(true);
            setSelectedBookshelf(shelf);
            setShowScrapManagement(true);
            return;
          }
        } catch {
          continue;
        }
      }
      setIsScraped(false);
      setSelectedBookshelf(null);
      setShowScrapManagement(false);
    } catch {
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
          await fetchGroo.bookshelf.deleteBookScrap(selectedBookshelf.bookshelfId, isbn);

          setIsScraped(false);
          setShowScrapManagement(false);
          setSelectedBookshelf(null);

          alert('스크랩이 제거되었습니다.');
        } catch (error: any) {
          alert(`스크랩 제거에 실패했습니다. ${error.response?.data?.message || error.message}`);
        }
      }
    } else {
      setShowCategoryModal(true);
    }
  };

  const handleCategorySelect = async (bookshelfId: number, name: string) => {
    try {
      const requestData = {
        bookshelfId: bookshelfId,
        ISBN: isbn // 대문자 ISBN
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
      await fetchGroo.bookshelf.deleteBookScrap(selectedBookshelf.bookshelfId, isbn);

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
    router.push(`/reviews/write?isbn=${isbn}&from=/books/${isbn}`);
  };

  const handleCreateBookshelf = async () => {
    if (!newBookshelfName.trim()) {
      alert('책장 이름을 입력해주세요.');
      return;
    }

    setIsCreatingBookshelf(true);
    try {
      const newShelf = await fetchGroo.bookshelf.createBookshelf({ name: newBookshelfName.trim() });

      if (isScraped && selectedBookshelf) {
        await handleChangeCategory(newShelf.bookshelfId, newShelf.name);
      } else {
        await handleCategorySelect(newShelf.bookshelfId, newShelf.name);
      }

      await fetchBookshelves();
      setNewBookshelfName('');
      setShowCreateInput(false);
    } catch {
      alert('책장 생성에 실패했습니다.');
    } finally {
      setIsCreatingBookshelf(false);
    }
  };

  return (
    <>
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

export default BookProfileCardButtons;
