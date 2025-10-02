'use client';

import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

import { fetchGroo, fetchAladin } from '@/apis';
import BookInfoCard from '@/components/reviews/write/book-info-card';
import BookSearchModal from '@/components/reviews/write/book-search-modal';
import DraftListModal from '@/components/reviews/write/draft-list-modal';
import EditorToolbar from '@/components/reviews/write/editor-toolbar';
import styles from '@/components/reviews/write/review-create.module.scss';
import { ReviewCreateReqBody, ReviewUpdateReqBody, AladinBook } from '@/types/reviews';

// categoryName에서 두 번째 카테고리 추출 함수
const extractSecondCategory = (categoryName: string): string | null => {
  console.log('=== extractSecondCategory 시작 ===');
  console.log('입력 categoryName:', categoryName);

  const categories = categoryName.split('>');
  console.log('split 결과:', categories);
  console.log('배열 길이:', categories.length);

  if (categories.length >= 2) {
    const result = categories[1].trim();
    console.log('추출된 카테고리:', result);
    return result;
  }

  console.log('카테고리 추출 실패 - 배열 길이 부족');
  return null;
};

function ReviewCreatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const draftId = searchParams.get('draftId');

  const [selectedBook, setSelectedBook] = useState<AladinBook | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [isSecret, setIsSecret] = useState(false);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [isDraftModalOpen, setIsDraftModalOpen] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'text-blue-600 underline' }
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

  useEffect(() => {
    if (draftId) {
      loadDraft(Number(draftId));
    }
  }, [draftId]);

  const loadDraft = async (id: number) => {
    try {
      const draft = await fetchGroo.review.getDraft(id);

      if (draft) {
        setTitle(draft.reviewTitle);
        editor?.commands.setContent(draft.reviewContent);
        setIsSecret(false);

        if (draft.isbn) {
          await loadBookInfo(draft.isbn);
        }
      }
    } catch (error) {
      alert('임시저장 글을 불러오는데 실패했습니다.');
      console.error(error);
    }
  };

  const loadBookInfo = async (isbn: string) => {
    console.log('=== loadBookInfo 시작 ===');
    console.log('ISBN:', isbn);

    try {
      const aladinResponse = await fetchAladin.getBookDetails(isbn);
      console.log('알라딘 API 응답:', aladinResponse);

      if (aladinResponse.item && aladinResponse.item.length > 0) {
        const book = aladinResponse.item[0];
        console.log('선택된 도서:', book);
        console.log('도서 categoryName:', book.categoryName);

        setSelectedBook(book);

        if (book.categoryName) {
          const secondCategory = extractSecondCategory(book.categoryName);
          console.log('최종 카테고리:', secondCategory);

          if (secondCategory) {
            setCategory(secondCategory);
            console.log('카테고리 state 설정 완료');
          }
        } else {
          console.log('categoryName이 없습니다');
        }
      }
    } catch (error) {
      console.error('도서 정보 조회 실패:', error);
    }
  };

  const handleBookSelect = async (book: AladinBook) => {
    console.log('=== handleBookSelect 시작 ===');
    console.log('선택된 도서:', book);
    console.log('도서 categoryName:', book.categoryName);

    setSelectedBook(book);
    setIsBookModalOpen(false);

    if (book.categoryName) {
      const secondCategory = extractSecondCategory(book.categoryName);
      console.log('추출된 카테고리:', secondCategory);

      if (secondCategory) {
        setCategory(secondCategory);
        console.log('카테고리 state 설정:', secondCategory);
      } else {
        console.error('카테고리 추출 실패:', book.categoryName);
      }
    } else {
      console.error('categoryName이 없습니다');
    }
  };

  const handleSaveDraft = async () => {
    if (!selectedBook || !title || !editor) {
      alert('도서와 제목을 입력해주세요.');
      return;
    }

    if (!category) {
      alert('도서 카테고리 정보를 가져올 수 없습니다.');
      return;
    }

    const requestData: ReviewCreateReqBody = {
      isbn: selectedBook.isbn13,
      reviewTitle: title,
      reviewContent: editor.getHTML(),
      secret: isSecret,
      temporary: true,
      category: category
    };

    console.log('=== 임시저장 요청 데이터 ===');
    console.log(JSON.stringify(requestData, null, 2));

    try {
      await fetchGroo.review.createReview(requestData);
      alert('임시저장되었습니다.');
      router.push('/reviews');
    } catch (error) {
      alert('임시저장에 실패했습니다.');
      console.error('임시저장 에러:', error);
    }
  };

  const handleSubmit = async () => {
    console.log('=== handleSubmit 시작 ===');
    console.log('selectedBook:', selectedBook);
    console.log('title:', title);
    console.log('category:', category);
    console.log('draftId:', draftId);

    if (!selectedBook || !title || !editor) {
      alert('모든 항목을 입력해주세요.');
      return;
    }

    if (!category) {
      console.error('카테고리가 없습니다!');
      alert('도서 카테고리 정보를 가져올 수 없습니다.');
      return;
    }

    const content = editor.getHTML();
    if (content.replace(/<[^>]*>/g, '').trim().length === 0) {
      alert('내용을 입력해주세요.');
      return;
    }

    try {
      if (draftId) {
        // 임시저장 글에서 온 경우: 수정 API 사용하여 temporary를 false로 변경
        const updateData: ReviewUpdateReqBody = {
          reviewTitle: title,
          reviewContent: content,
          secret: isSecret,
          temporary: false // 정식 글로 전환
        };

        console.log('=== 임시저장 글 수정 요청 데이터 ===');
        console.log(JSON.stringify(updateData, null, 2));

        await fetchGroo.review.updateReview(Number(draftId), updateData);
        alert('독후감이 작성되었습니다.');
      } else {
        // 새 글 작성인 경우: 생성 API 사용
        const requestData: ReviewCreateReqBody = {
          isbn: selectedBook.isbn13,
          reviewTitle: title,
          reviewContent: content,
          secret: isSecret,
          temporary: false,
          category: category
        };

        console.log('=== 새 독후감 작성 요청 데이터 ===');
        console.log(JSON.stringify(requestData, null, 2));

        await fetchGroo.review.createReview(requestData);
        alert('독후감이 작성되었습니다.');
      }

      router.push('/reviews');
    } catch (error) {
      console.error('=== 독후감 작성 에러 ===');
      console.error('에러 상세:', error);
      alert('독후감 작성에 실패했습니다.');
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
        <section className={styles.bookSection}>
          {selectedBook ? (
            <BookInfoCard
              book={selectedBook}
              onRemove={() => {
                setSelectedBook(null);
                setCategory(null);
              }}
            />
          ) : (
            <button onClick={() => setIsBookModalOpen(true)} className={styles.selectBookButton}>
              도서 선택하기
            </button>
          )}
        </section>

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

        {editor && <EditorToolbar editor={editor} />}

        <section className={styles.editorSection}>
          <EditorContent editor={editor} />
        </section>

        <section className={styles.optionsSection}>
          <label className={styles.checkbox}>
            <input type="checkbox" checked={isSecret} onChange={(e) => setIsSecret(e.target.checked)} />
            <span>비밀글로 설정</span>
          </label>
        </section>
      </div>

      {isBookModalOpen && (
        <BookSearchModal onSelect={handleBookSelect} onClose={() => setIsBookModalOpen(false)} />
      )}

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
