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
import { ArrowLeft } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

import { fetchGroo, fetchAladin } from '@/apis';
import BookInfoCard from '@/components/reviews/write/book-info-card';
import BookSearchModal from '@/components/reviews/write/book-search-modal';
import DraftListModal from '@/components/reviews/write/draft-list-modal';
import editorStyles from '@/components/reviews/write/editor-content.module.scss';
import EditorToolbar from '@/components/reviews/write/editor-toolbar';
import styles from '@/components/reviews/write/review-create.module.scss';
import ThumbnailModal from '@/components/reviews/write/thumbnail-modal';
import { ReviewCreateReqBody, ReviewUpdateReqBody, AladinBook } from '@/types/reviews';
import { getReviewErrorMessage } from '@/utils/error/review-error-handler';

const extractSecondCategory = (categoryName: string): string | null => {
  const categories = categoryName.split('>');
  if (categories.length >= 2) {
    return categories[1].trim();
  }
  return null;
};

function ReviewCreatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const draftId = searchParams.get('draftId');
  const fromPath = searchParams.get('from');
  const [customThumbnail, setCustomThumbnail] = useState<string | null>(null);

  const [selectedBook, setSelectedBook] = useState<AladinBook | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [isSecret, setIsSecret] = useState(false);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [isDraftModalOpen, setIsDraftModalOpen] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const MAX_TEXT_LENGTH = 10000;
  const MAX_HTML_LENGTH = 30000;

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
        limit: MAX_HTML_LENGTH
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
      const currentTextLength = textContent.replace(/\s/g, '').length;
      setCharCount(currentTextLength);

      const htmlLength = editor.getHTML().length;
      if (htmlLength > MAX_HTML_LENGTH) {
        alert(`HTML 포함 ${MAX_HTML_LENGTH}자를 초과했습니다. (현재: ${htmlLength}자)`);
        editor.commands.setContent(editor.getHTML().slice(0, MAX_HTML_LENGTH));
      }
    }
  });

  useEffect(() => {
    const isbn = searchParams.get('isbn');

    if (isbn && !draftId) {
      loadBookByIsbn(isbn);
    }
  }, []);

  useEffect(() => {
    if (draftId && editor) {
      loadDraft(Number(draftId));
    }
  }, [draftId, editor]);

  const loadBookByIsbn = async (isbn: string) => {
    try {
      const response = await fetchAladin.getBookDetails(isbn);
      if (response.item && response.item.length > 0) {
        const bookData = response.item[0];
        const aladinBook: AladinBook = {
          title: bookData.title,
          author: bookData.author,
          pubDate: bookData.pubDate,
          description: bookData.description,
          isbn: bookData.isbn,
          isbn13: bookData.isbn13,
          itemId: bookData.itemId,
          priceSales: bookData.priceSales,
          priceStandard: bookData.priceStandard,
          mallType: bookData.mallType,
          stockStatus: bookData.stockStatus,
          mileage: bookData.mileage,
          cover: bookData.cover,
          categoryId: bookData.categoryId,
          categoryName: bookData.categoryName,
          publisher: bookData.publisher,
          customerReviewRank: bookData.customerReviewRank,
          link: bookData.link
        };

        setSelectedBook(aladinBook);
        const extractedCategory = extractSecondCategory(bookData.categoryName);
        setCategory(extractedCategory);
      }
    } catch (error) {}
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      alert('이미지 크기는 5MB 이하여야 합니다.');
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setCustomThumbnail(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setCustomThumbnail(null);
  };

  const loadDraft = async (id: number) => {
    try {
      const draft = await fetchGroo.review.getDraft(id);
      if (draft) {
        setTitle(draft.reviewTitle);
        editor?.commands.setContent(draft.reviewContent);
        setIsSecret(false);
        if (draft.customThumbnail) {
          setCustomThumbnail(draft.customThumbnail);
        }
        if (draft.isbn) {
          await loadBookInfo(draft.isbn);
        }
      }
    } catch (error: any) {
      alert(getReviewErrorMessage(error));
    }
  };

  const loadBookInfo = async (isbn: string) => {
    try {
      const aladinResponse = await fetchAladin.getBookDetails(isbn);
      if (aladinResponse.item && aladinResponse.item.length > 0) {
        const book = aladinResponse.item[0];
        setSelectedBook(book);
        if (book.categoryName) {
          const secondCategory = extractSecondCategory(book.categoryName);
          if (secondCategory) setCategory(secondCategory);
        }
      }
    } catch (error) {}
  };

  const handleBookSelect = async (book: AladinBook) => {
    setSelectedBook(book);
    setIsBookModalOpen(false);
    if (book.categoryName) {
      const secondCategory = extractSecondCategory(book.categoryName);
      if (secondCategory) setCategory(secondCategory);
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
      category: category,
      customThumbnail: customThumbnail || undefined
    };
    try {
      await fetchGroo.review.createReview(requestData);
      alert('임시저장되었습니다.');
      router.push('/reviews/feed');
    } catch (error: any) {
      alert(getReviewErrorMessage(error));
    }
  };

  const handleSubmit = async () => {
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
          temporary: false,
          customThumbnail: customThumbnail || undefined
        };
        await fetchGroo.review.updateReview(Number(draftId), updateData);
        alert('독후감이 작성되었습니다.');
      } else {
        const requestData: ReviewCreateReqBody = {
          isbn: selectedBook.isbn13,
          reviewTitle: title,
          reviewContent: content,
          secret: isSecret,
          temporary: false,
          ...(category ? { category } : {}),
          customThumbnail: customThumbnail || undefined
        };
        await fetchGroo.review.createReview(requestData);
        alert('독후감이 작성되었습니다.');
      }
      router.push('/reviews/feed');
    } catch (error: any) {
      alert(getReviewErrorMessage(error));
    }
  };

  const handleBack = () => {
    if (fromPath) {
      router.push(fromPath);
    } else {
      router.back();
    }
  };

  const handleDraftSelect = (selectedDraftId: number) => {
    setIsDraftModalOpen(false);
    const params = new URLSearchParams();
    params.set('draftId', selectedDraftId.toString());
    if (fromPath) {
      params.set('from', fromPath);
    }
    router.replace(`/reviews/write?${params.toString()}`);
  };

  const [isThumbnailModalOpen, setIsThumbnailModalOpen] = useState(false); // 썸네일 모달 상태 추가
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={handleBack} className={styles.backButton} aria-label="뒤로가기">
          <ArrowLeft size={20} />
        </button>
        <h1>독후감 작성</h1>

        <div className={styles.headerActions}>
          {/* 썸네일 추가 버튼 클릭 시 */}
          <button
            type="button"
            className={styles.thumbnailButton}
            onClick={() => setIsThumbnailModalOpen(true)}>
            썸네일 추가
          </button>

          {/* 썸네일 업로드 모달 */}
          {isThumbnailModalOpen && (
            <ThumbnailModal
              currentThumbnail={customThumbnail}
              onClose={() => setIsThumbnailModalOpen(false)}
              onConfirm={(thumb) => {
                setCustomThumbnail(thumb);
                setIsThumbnailModalOpen(false);
              }}
            />
          )}

          {/* 임시저장 버튼 */}
          <button type="button" onClick={() => setIsDraftModalOpen(true)} className={styles.draftButton}>
            임시저장 목록
          </button>
        </div>
      </div>

      <div className={styles.content}>
        <section className={styles.titleSection}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="독후감 제목을 입력하세요"
            className={styles.titleInput}
          />
        </section>

        <section className={styles.bookSection}>
          {selectedBook ? (
            <BookInfoCard book={selectedBook} onRemove={() => setIsBookModalOpen(true)} />
          ) : (
            <button onClick={() => setIsBookModalOpen(true)} className={styles.selectBookButton}>
              도서 선택
            </button>
          )}
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
        <DraftListModal onClose={() => setIsDraftModalOpen(false)} onSelect={handleDraftSelect} />
      )}
    </div>
  );
}

export default ReviewCreatePage;
