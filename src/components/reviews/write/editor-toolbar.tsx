'use client';

import { Editor } from '@tiptap/react';

import styles from '@/components/reviews/write/editor-toolbar.module.scss';

interface EditorToolbarProps {
  editor: Editor;
}

function EditorToolbar({ editor }: EditorToolbarProps) {
  if (!editor) {
    return null;
  }

  return (
    <div className={styles.toolbar}>
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? styles.active : ''}
        title="굵게 (Ctrl+B)">
        <strong>B</strong>
      </button>

      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? styles.active : ''}
        title="기울임 (Ctrl+I)">
        <em>I</em>
      </button>

      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={editor.isActive('underline') ? styles.active : ''}
        title="밑줄 (Ctrl+U)">
        <u>U</u>
      </button>

      <div className={styles.divider} />

      <button
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={editor.isActive('paragraph') ? styles.active : ''}
        title="본문">
        본문
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={editor.isActive('heading', { level: 1 }) ? styles.active : ''}
        title="제목 1">
        H1
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive('heading', { level: 2 }) ? styles.active : ''}
        title="제목 2">
        H2
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={editor.isActive('heading', { level: 3 }) ? styles.active : ''}
        title="제목 3">
        H3
      </button>

      <div className={styles.divider} />

      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive('bulletList') ? styles.active : ''}
        title="글머리 기호">
        목록
      </button>

      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive('orderedList') ? styles.active : ''}
        title="번호 매기기">
        1.
      </button>

      <div className={styles.divider} />

      <button
        onClick={() => {
          const url = window.prompt('URL을 입력하세요:');
          if (url) {
            editor.chain().focus().setLink({ href: url }).run();
          }
        }}
        className={editor.isActive('link') ? styles.active : ''}
        title="링크 추가">
        링크
      </button>

      <button
        onClick={() => editor.chain().focus().unsetLink().run()}
        disabled={!editor.isActive('link')}
        title="링크 제거">
        링크해제
      </button>
    </div>
  );
}

export default EditorToolbar;
