'use client';

import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

import { fetchGroo, fetchAladin, fetchLibrary } from '@/apis';
import styles from '@/components/reviews/review-create.module.scss';
import BookInfoCard from '@/components/reviews/write/book-info-card';
import BookSearchModal from '@/components/reviews/write/book-search-modal';
import DraftListModal from '@/components/reviews/write/draft-list-modal';
import EditorToolbar from '@/components/reviews/write/editor-toolbar';
import { ReviewCreateReqBody, AladinBook, LibraryBook } from '@/types/reviews';

function ReviewCreatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const draftId = searchParams.get('draftId');

  // 선택된 도서 정보
  const [selectedBook, setSelectedBook] = useState<AladinBook | null>(null);
  const [libraryBook, setLibraryBook] = useState<LibraryBook | null>(null);
  const [codeId, setCodeId] = useState<number | null>(null);

  // 독후감 작성 폼 데이터
  const [title, setTitle] = useState('');
  const [isSecret, setIsSecret] = useState(false);

  // 모달 상태
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [isDraftModalOpen, setIsDraftModalOpen] = useState(false);

  // Tiptap 에디터 설정
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline'
        }
      }),
      Placeholder.configure({
        placeholder: '독후감 내용을 입력해주세요'
      })
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none min-h-[400px] p-4'
      }
    }
  });

  // 임시저장 불러오기
  useEffect(() => {
    if (draftId) {
      loadDraft(Number(draftId));
    }
  }, [draftId]);

  // 임시저장 불러오기 함수
  const loadDraft = async (id: number) => {
    try {
      const response = await fetchGroo.review.getDraft(id);
      const draft = response.data;

      if (draft) {
        setTitle(draft.reviewTitle);
        editor?.commands.setContent(draft.reviewContent);
        setIsSecret(false); // 임시저장에는 secret 정보가 없으므로 기본값

        // ISBN으로 도서 정보 다시 불러오기
        if (draft.isbn) {
          await loadBookInfo(draft.isbn);
        }
      }
    } catch (error) {
      alert('임시저장 글을 불러오는데 실패했습니다.');
      console.error(error);
    }
  };

  // 도서 정보 불러오기
  const loadBookInfo = async (isbn: string) => {
    try {
      // 알라딘 API로 도서 기본 정보 조회
      const aladinResponse = await fetchAladin.getBookDetails(isbn);
      if (aladinResponse.data.item && aladinResponse.data.item.length > 0) {
        setSelectedBook(aladinResponse.data.item[0]);
      }

      // 정보나루 API로 도서 카테고리 정보 조회
      const libraryResponse = await fetchLibrary.getBookDetail(isbn);
      if (libraryResponse.response?.docs && libraryResponse.response.docs.length > 0) {
        const bookData = libraryResponse.response.docs[0].doc;
        setLibraryBook(bookData);

        // class_no를 codeId로 매핑 (KDC 분류 코드)
        if (bookData.class_no) {
          const kdcCode = Math.floor(parseInt(bookData.class_no) / 100);
          setCodeId(kdcCode);
        }
      }
    } catch (error) {
      console.error('도서 정보 조회 실패:', error);
    }
  };

  // 도서 선택 핸들러
  const handleBookSelect = async (book: AladinBook) => {
    setSelectedBook(book);
    setIsBookModalOpen(false);

    // 정보나루 API로 카테고리 정보 가져오기
    try {
      const response = await fetchLibrary.getBookDetail(book.isbn13);
      if (response.response?.docs && response.response.docs.length > 0) {
        const bookData = response.response.docs[0].doc;
        setLibraryBook(bookData);

        // KDC 분류번호를 codeId로 변환
        if (bookData.class_no) {
          const kdcCode = Math.floor(parseInt(bookData.class_no) / 100);
          setCodeId(kdcCode);
        }
      }
    } catch (error) {
      console.error('정보나루 도서 정보 조회 실패:', error);
    }
  };

  // 임시저장 핸들러
  const handleSaveDraft = async () => {
    if (!selectedBook || !title || !editor) {
      alert('도서와 제목을 입력해주세요.');
      return;
    }

    if (!codeId) {
      alert('도서 카테고리 정보를 가져올 수 없습니다.');
      return;
    }

    const requestData: ReviewCreateReqBody = {
      isbn: selectedBook.isbn13,
      reviewTitle: title,
      reviewContent: editor.getHTML(),
      secret: isSecret,
      temporary: true,
      codeId: codeId
    };

    try {
      await fetchGroo.review.createReview(requestData);
      alert('임시저장되었습니다.');
      router.push('/reviews');
    } catch (error) {
      alert('임시저장에 실패했습니다.');
      console.error(error);
    }
  };

  // 독후감 제출 핸들러
  const handleSubmit = async () => {
    if (!selectedBook || !title || !editor) {
      alert('모든 항목을 입력해주세요.');
      return;
    }

    if (!codeId) {
      alert('도서 카테고리 정보를 가져올 수 없습니다.');
      return;
    }

    const content = editor.getHTML();
    if (content.replace(/<[^>]*>/g, '').trim().length === 0) {
      alert('내용을 입력해주세요.');
      return;
    }

    const requestData: ReviewCreateReqBody = {
      isbn: selectedBook.isbn13,
      reviewTitle: title,
      reviewContent: content,
      secret: isSecret,
      temporary: false,
      codeId: codeId
    };

    try {
      await fetchGroo.review.createReview(requestData);
      alert('독후감이 작성되었습니다.');
      router.push('/reviews');
    } catch (error) {
      alert('독후감 작성에 실패했습니다.');
      console.error(error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={() => router.back()} className={styles.backButton}>
          뒤로가기
        </button>
        <h1>독후감 작성</h1>
        <div className={styles.actions}>
          <button onClick={() => setIsDraftModalOpen(true)} className={styles.draftButton}>
            임시저장 목록
          </button>
          <button onClick={handleSaveDraft} className={styles.saveButton}>
            임시저장
          </button>
          <button onClick={handleSubmit} className={styles.submitButton}>
            등록
          </button>
        </div>
      </div>

      <div className={styles.content}>
        {/* 도서 선택 영역 */}
        <section className={styles.bookSection}>
          {selectedBook ? (
            <BookInfoCard
              book={selectedBook}
              libraryBook={libraryBook}
              onRemove={() => {
                setSelectedBook(null);
                setLibraryBook(null);
                setCodeId(null);
              }}
            />
          ) : (
            <button onClick={() => setIsBookModalOpen(true)} className={styles.selectBookButton}>
              도서 선택하기
            </button>
          )}
        </section>

        {/* 제목 입력 */}
        <section className={styles.titleSection}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="독후감 제목을 작성해주세요"
            className={styles.titleInput}
            maxLength={200}
          />
          <span className={styles.charCount}>{title.length} / 200</span>
        </section>

        {/* 에디터 툴바 */}
        {editor && <EditorToolbar editor={editor} />}

        {/* 에디터 영역 */}
        <section className={styles.editorSection}>
          <EditorContent editor={editor} />
        </section>

        {/* 옵션 */}
        <section className={styles.optionsSection}>
          <label className={styles.checkbox}>
            <input type="checkbox" checked={isSecret} onChange={(e) => setIsSecret(e.target.checked)} />
            <span>비밀글로 설정</span>
          </label>
        </section>
      </div>

      {/* 도서 검색 모달 */}
      {isBookModalOpen && (
        <BookSearchModal onSelect={handleBookSelect} onClose={() => setIsBookModalOpen(false)} />
      )}

      {/* 임시저장 목록 모달 */}
      {isDraftModalOpen && (
        <DraftListModal
          onClose={() => setIsDraftModalOpen(false)}
          onSelect={(draftId) => {
            setIsDraftModalOpen(false);
            router.push(`/reviews/write?draftId=${draftId}`);
          }}
        />
      )}
    </div>
  );
}

export default ReviewCreatePage;
