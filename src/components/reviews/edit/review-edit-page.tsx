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
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';

import { fetchGroo, fetchAladin } from '@/apis';
import styles from '@/components/reviews/edit/review-edit.module.scss';
import BookInfoCard from '@/components/reviews/write/book-info-card';
import editorStyles from '@/components/reviews/write/editor-content.module.scss';
import EditorToolbar from '@/components/reviews/write/editor-toolbar';
import ThumbnailModal from '@/components/reviews/write/thumbnail-modal';
import { ReviewUpdateReqBody, AladinBook } from '@/types/reviews';
import { devLogger } from '@/utils/dev-logger';
import { getReviewErrorMessage } from '@/utils/error/review-error-handler';

const MAX_CONTENT_LENGTH = 10000;

function ReviewEditPage() {
  const router = useRouter();
  const params = useParams();
  const reviewId = Number(params.id);

  const [title, setTitle] = useState('');
  const [isSecret, setIsSecret] = useState(false);
  const [selectedBook, setSelectedBook] = useState<AladinBook | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviewContent, setReviewContent] = useState('');
  const [charCount, setCharCount] = useState(0);
  const [customThumbnail, setCustomThumbnail] = useState<string | null>(null);
  const [isThumbnailModalOpen, setIsThumbnailModalOpen] = useState(false);
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
    if (editor && reviewContent) {
      editor.commands.setContent(reviewContent);
      const textContent = editor.getText();
      setCharCount(textContent.length);
    }
  }, [editor, reviewContent]);

  useEffect(() => {
    loadReviewData();
  }, [reviewId]);

  const loadBookInfo = async (isbn: string) => {
    try {
      const aladinResponse = await fetchAladin.getBookDetails(isbn);
      if (aladinResponse.item && aladinResponse.item.length > 0) {
        const book = aladinResponse.item[0];
        setSelectedBook(book);
      }
    } catch (error) {
      devLogger(error, true);
    }
  };

  const loadReviewData = async () => {
    try {
      setLoading(true);
      const review = await fetchGroo.review.getReview(reviewId);
      if (review) {
        setTitle(review.reviewTitle);
        setIsSecret(review.secret);
        setReviewContent(review.reviewContent);

        // customThumbnail 로드
        if (review.customThumbnail) {
          setCustomThumbnail(review.customThumbnail);
        }

        if (review.isbn) {
          await loadBookInfo(review.isbn);
        }
      }
    } catch (error: any) {
      alert(getReviewErrorMessage(error));
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!editor) {
      alert('에디터가 초기화되지 않았습니다.');
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
      const updateData: ReviewUpdateReqBody = {
        reviewTitle: title,
        reviewContent: content,
        secret: isSecret,
        temporary: false,
        customThumbnail: customThumbnail || undefined
      };

      await fetchGroo.review.updateReview(reviewId, updateData);
      alert('독후감이 수정되었습니다.');
      router.push(`/reviews/${reviewId}`);
    } catch (error: any) {
      alert(getReviewErrorMessage(error));
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>로딩 중...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={() => router.back()} className={styles.backButton} aria-label="뒤로가기">
          <ArrowLeft size={20} />
        </button>
        <h1>독후감 수정</h1>

        <div className={styles.headerActions}>
          {/* 썸네일 추가/수정 버튼 */}
          <button
            type="button"
            className={styles.thumbnailButton}
            onClick={() => setIsThumbnailModalOpen(true)}>
            {customThumbnail ? '썸네일 수정' : '썸네일 추가'}
          </button>
        </div>
      </div>

      <div className={styles.content}>
        {/* 독후감 제목 */}
        <section className={styles.titleSection}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="독후감 제목을 입력하세요"
            className={styles.titleInput}
          />
        </section>

        {/* 썸네일 미리보기 (있는 경우) */}
        {customThumbnail && (
          <section className={styles.thumbnailPreviewSection}>
            <div className={styles.thumbnailPreview}>
              <img src={customThumbnail} alt="썸네일" />
            </div>
          </section>
        )}

        {/* 도서 정보 */}
        {selectedBook && (
          <section className={styles.bookSection}>
            <BookInfoCard book={selectedBook} onRemove={() => {}} readOnly />
          </section>
        )}

        {/* 본문 에디터 */}
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
            <button onClick={handleSubmit} className={styles.submitButton}>
              수정 완료
            </button>
          </div>
        </section>
      </div>

      {/* 썸네일 모달 */}
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
    </div>
  );
}

export default ReviewEditPage;
