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
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';

import { fetchGroo, fetchAladin } from '@/apis';
import styles from '@/components/reviews/edit/review-edit.module.scss';
import BookInfoCard from '@/components/reviews/write/book-info-card';
import editorStyles from '@/components/reviews/write/editor-content.module.scss';
import EditorToolbar from '@/components/reviews/write/editor-toolbar';
import { ReviewUpdateReqBody, AladinBook } from '@/types/reviews';

function ReviewEditPage() {
  const router = useRouter();
  const params = useParams();
  const reviewId = Number(params.id);

  const [title, setTitle] = useState('');
  const [isSecret, setIsSecret] = useState(false);
  const [selectedBook, setSelectedBook] = useState<AladinBook | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviewContent, setReviewContent] = useState('');
  const [charCount, setCharCount] = useState({ characters: 0, words: 0 }); // 추가

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
      CharacterCount,
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
    // onUpdate 콜백 추가
    onUpdate: ({ editor }) => {
      setCharCount({
        characters: editor.storage.characterCount.characters(),
        words: editor.storage.characterCount.words()
      });
    }
  });

  useEffect(() => {
    if (editor && reviewContent) {
      editor.commands.setContent(reviewContent);
      // 초기 로드 시에도 글자수 설정
      setCharCount({
        characters: editor.storage.characterCount.characters(),
        words: editor.storage.characterCount.words()
      });
    }
  }, [editor, reviewContent]);

  useEffect(() => {
    loadReviewData();
  }, [reviewId]);

  const loadBookInfo = async (isbn: string) => {
    console.log('=== loadBookInfo 시작 ===');
    console.log('ISBN:', isbn);

    try {
      const aladinResponse = await fetchAladin.getBookDetails(isbn);
      console.log('알라딘 API 응답:', aladinResponse);

      if (aladinResponse.item && aladinResponse.item.length > 0) {
        const book = aladinResponse.item[0];
        console.log('선택된 도서:', book);
        setSelectedBook(book);
      }
    } catch (error) {
      console.error('도서 정보 조회 실패:', error);
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

        if (review.isbn) {
          await loadBookInfo(review.isbn);
        }
      }
    } catch (error) {
      console.error('독후감 불러오기 실패:', error);
      alert('독후감을 불러오는데 실패했습니다.');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!title || !editor) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }

    const content = editor.getHTML();
    if (content.replace(/<[^>]*>/g, '').trim().length === 0) {
      alert('내용을 입력해주세요.');
      return;
    }

    try {
      const updateData: ReviewUpdateReqBody = {
        reviewTitle: title,
        reviewContent: content,
        secret: isSecret,
        temporary: false
      };

      await fetchGroo.review.updateReview(reviewId, updateData);
      alert('독후감이 수정되었습니다.');
      router.push(`/reviews/${reviewId}`);
    } catch (error) {
      console.error('독후감 수정 실패:', error);
      alert('독후감 수정에 실패했습니다.');
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
        <button onClick={() => router.back()} className={styles.backButton}>
          뒤로가기
        </button>
        <h1>독후감 수정</h1>
        <div className={styles.actions}>
          <button onClick={handleSubmit} className={styles.submitButton}>
            수정 완료
          </button>
        </div>
      </div>

      <div className={styles.content}>
        {selectedBook && (
          <section className={styles.bookSection}>
            <BookInfoCard book={selectedBook} onRemove={() => {}} readOnly />
          </section>
        )}

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
          {/* 글자수 표시 수정 */}
          <div className={styles.characterCount}>
            {charCount.characters}자 / {charCount.words}단어
          </div>
        </section>

        <section className={styles.optionsSection}>
          <label className={styles.checkbox}>
            <input type="checkbox" checked={isSecret} onChange={(e) => setIsSecret(e.target.checked)} />
            비밀글로 설정
          </label>
        </section>
      </div>
    </div>
  );
}

export default ReviewEditPage;
