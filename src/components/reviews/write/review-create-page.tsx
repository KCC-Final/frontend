'use client';

import { CharacterCount } from '@tiptap/extension-character-count';
import { Color } from '@tiptap/extension-color';
import { Highlight } from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { Subscript } from '@tiptap/extension-subscript';
import { Superscript } from '@tiptap/extension-superscript';
import { Table } from '@tiptap/extension-table';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableRow } from '@tiptap/extension-table-row';
import { TaskItem } from '@tiptap/extension-task-item';
import { TaskList } from '@tiptap/extension-task-list';
import { TextAlign } from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

import { fetchGroo, fetchAladin } from '@/apis';
import BookInfoCard from '@/components/reviews/write/book-info-card';
import BookSearchModal from '@/components/reviews/write/book-search-modal';
import DraftListModal from '@/components/reviews/write/draft-list-modal';
import editorStyles from '@/components/reviews/write/editor-content.module.scss';
import EditorToolbar from '@/components/reviews/write/editor-toolbar';
import styles from '@/components/reviews/write/review-create.module.scss';
import { ReviewCreateReqBody, ReviewUpdateReqBody, AladinBook } from '@/types/reviews';
import { getReviewErrorMessage } from '@/utils/error/review-error-handler';

const MAX_CONTENT_LENGTH = 10000;

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
  const [charCount, setCharCount] = useState(0);
  const MAX_TEXT_LENGTH = 10000; // 순수 텍스트 기준
  const MAX_HTML_LENGTH = 30000; // HTML + 공백 포함 기준

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
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph']
      }),
      Highlight.configure({
        multicolor: true
      }),
      TextStyle,
      Color,
      CharacterCount.configure({
        limit: MAX_HTML_LENGTH // HTML 포함 전체 길이 제한
      }),
      TaskList,
      TaskItem.configure({
        nested: true
      }),
      Table.configure({
        resizable: true
      }),
      TableRow,
      TableHeader,
      TableCell,
      Superscript,
      Subscript
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'editor-content'
      }
    },
    onUpdate: ({ editor }) => {
      const textContent = editor.getText();
      const currentTextLength = textContent.replace(/\s/g, '').length; // 순수 텍스트
      setCharCount(currentTextLength);

      const htmlLength = editor.getHTML().length;
      if (htmlLength > MAX_HTML_LENGTH) {
        alert(`HTML 포함 ${MAX_HTML_LENGTH}자를 초과했습니다. (현재: ${htmlLength}자)`);
        editor.commands.setContent(editor.getHTML().slice(0, MAX_HTML_LENGTH));
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
    } catch (error: any) {
      alert(getReviewErrorMessage(error));
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
      // 도서 정보는 필수가 아니므로 에러 알림 없이 진행
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
      router.push('/reviews/feed');
    } catch (error: any) {
      alert(getReviewErrorMessage(error));
      console.error('임시저장 에러:', error);
    }
  };

  const handleSubmit = async () => {
    // 1) 런타임 가드로 null 제거 (TS 오류 해결)
    if (!editor) {
      alert('에디터가 초기화되지 않았습니다. 새로고침 후 다시 시도해주세요.');
      return;
    }
    if (!selectedBook) {
      alert('도서를 먼저 선택해주세요.');
      return;
    }
    if (!title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }

    // 2) 이제부터 non-null 보장
    const content = editor.getHTML();
    const textContent = editor.getText();
    const textLength = textContent.replace(/\s/g, '').length;
    const htmlLength = content.length;

    if (textLength === 0) {
      alert('내용을 입력해주세요.');
      return;
    }
    if (htmlLength > MAX_HTML_LENGTH) {
      alert(`HTML 포함 ${MAX_HTML_LENGTH}자를 초과할 수 없습니다. (현재: ${htmlLength}자)`);
      return;
    }
    if (textLength > MAX_TEXT_LENGTH) {
      alert(`순수 텍스트는 ${MAX_TEXT_LENGTH}자를 초과할 수 없습니다. (현재: ${textLength}자)`);
      return;
    }

    try {
      if (draftId) {
        const updateData: ReviewUpdateReqBody = {
          reviewTitle: title,
          reviewContent: content,
          secret: isSecret,
          temporary: false
        };
        console.log('=== 임시저장 글 수정 요청 데이터 ===');
        console.log(JSON.stringify(updateData, null, 2));

        await fetchGroo.review.updateReview(Number(draftId), updateData);
        alert('독후감이 작성되었습니다.');
      } else {
        // 3) category가 null이면 필드 자체를 제외 (optional이라 가능)
        const requestData: ReviewCreateReqBody = {
          isbn: selectedBook.isbn13,
          reviewTitle: title,
          reviewContent: content,
          secret: isSecret,
          temporary: false,
          ...(category ? { category } : {}) // ★ 핵심: null -> undefined(미포함) 처리
        };
        console.log('=== 새 독후감 작성 요청 데이터 ===');
        console.log(JSON.stringify(requestData, null, 2));

        await fetchGroo.review.createReview(requestData);
        alert('독후감이 작성되었습니다.');
      }

      router.push('/reviews/feed');
    } catch (error: any) {
      console.error('=== 독후감 작성 에러 ===');
      console.error('에러 상세:', error);
      alert(getReviewErrorMessage(error));
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={() => router.back()} className={styles.backButton}>
          뒤로가기
        </button>
        <h1>독후감 작성</h1>
        <button onClick={() => setIsDraftModalOpen(true)} className={styles.draftButton}>
          임시저장 목록
        </button>
      </div>
      <div className={styles.content}>
        <section className={styles.bookSection}>
          {selectedBook ? (
            <BookInfoCard book={selectedBook} onRemove={() => setIsBookModalOpen(true)} />
          ) : (
            <button onClick={() => setIsBookModalOpen(true)} className={styles.selectBookButton}>
              도서 선택
            </button>
          )}
        </section>

        <section className={styles.titleSection}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="독후감 제목을 입력하세요"
            className={styles.titleInput}
          />
        </section>

        <section className={styles.editorSection}>
          {editor && <EditorToolbar editor={editor} />}
          <div className={editorStyles.editorContent}>
            <EditorContent editor={editor} />
          </div>
          <div className={`${styles.characterCount} ${charCount > MAX_TEXT_LENGTH ? styles.exceeded : ''}`}>
            {charCount.toLocaleString()} / {MAX_TEXT_LENGTH.toLocaleString()}자
          </div>
        </section>

        <section className={styles.optionsSection}>
          <label className={styles.checkbox}>
            <input type="checkbox" checked={isSecret} onChange={(e) => setIsSecret(e.target.checked)} />
            비밀글로 설정
          </label>
          <div className={styles.submitActions}>
            <button onClick={handleSaveDraft} className={styles.saveButton}>
              임시저장
            </button>
            <button onClick={handleSubmit} className={styles.submitButton}>
              등록
            </button>
          </div>
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
