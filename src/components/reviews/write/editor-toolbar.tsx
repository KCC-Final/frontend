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
      {/* 기본 서식 */}
      <div className={styles.group}>
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

        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={editor.isActive('strike') ? styles.active : ''}
          title="취소선">
          <s>S</s>
        </button>
      </div>

      <div className={styles.divider} />

      {/* 제목 */}
      <div className={styles.group}>
        <button
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={editor.isActive('paragraph') ? styles.active : ''}
          title="본문">
          본문
        </button>

        <button
          onClick={() => editor.chain().focus().setHeading({ level: 1 }).run()}
          className={editor.isActive('heading', { level: 1 }) ? styles.active : ''}
          title="제목 1">
          H1
        </button>

        <button
          onClick={() => editor.chain().focus().setHeading({ level: 2 }).run()}
          className={editor.isActive('heading', { level: 2 }) ? styles.active : ''}
          title="제목 2">
          H2
        </button>

        <button
          onClick={() => editor.chain().focus().setHeading({ level: 3 }).run()}
          className={editor.isActive('heading', { level: 3 }) ? styles.active : ''}
          title="제목 3">
          H3
        </button>
      </div>

      <div className={styles.divider} />

      {/* 텍스트 정렬 */}
      <div className={styles.group}>
        <button
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={editor.isActive({ textAlign: 'left' }) ? styles.active : ''}
          title="왼쪽 정렬">
          ⬅
        </button>

        <button
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={editor.isActive({ textAlign: 'center' }) ? styles.active : ''}
          title="가운데 정렬">
          ↔
        </button>

        <button
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={editor.isActive({ textAlign: 'right' }) ? styles.active : ''}
          title="오른쪽 정렬">
          ➡
        </button>
      </div>

      <div className={styles.divider} />

      {/* 하이라이트 */}
      <div className={styles.group}>
        <button
          onClick={() => editor.chain().focus().toggleHighlight({ color: '#fff59d' }).run()}
          className={editor.isActive('highlight', { color: '#fff59d' }) ? styles.active : ''}
          title="노란색 형광펜"
          style={{ background: '#fff59d' }}>
          H
        </button>

        <button
          onClick={() => editor.chain().focus().toggleHighlight({ color: '#a7ffeb' }).run()}
          className={editor.isActive('highlight', { color: '#a7ffeb' }) ? styles.active : ''}
          title="민트색 형광펜"
          style={{ background: '#a7ffeb' }}>
          H
        </button>

        <button
          onClick={() => editor.chain().focus().toggleHighlight({ color: '#f8bbd0' }).run()}
          className={editor.isActive('highlight', { color: '#f8bbd0' }) ? styles.active : ''}
          title="핑크색 형광펜"
          style={{ background: '#f8bbd0' }}>
          H
        </button>

        <button
          onClick={() => editor.chain().focus().unsetHighlight().run()}
          disabled={!editor.isActive('highlight')}
          title="하이라이트 제거">
          ✕
        </button>
      </div>

      <div className={styles.divider} />

      {/* 글자색 */}
      <div className={styles.group}>
        <input
          type="color"
          onInput={(e) =>
            editor
              .chain()
              .focus()
              .setColor((e.target as HTMLInputElement).value)
              .run()
          }
          value={editor.getAttributes('textStyle').color || '#000000'}
          title="글자색"
          className={styles.colorPicker}
        />

        <button onClick={() => editor.chain().focus().unsetColor().run()} title="글자색 초기화">
          A
        </button>
      </div>

      <div className={styles.divider} />

      {/* 목록 */}
      <div className={styles.group}>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? styles.active : ''}
          title="글머리 기호">
          •
        </button>

        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? styles.active : ''}
          title="번호 매기기">
          1.
        </button>

        <button
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          className={editor.isActive('taskList') ? styles.active : ''}
          title="체크리스트">
          ☑
        </button>
      </div>

      <div className={styles.divider} />

      {/* 표 */}
      <div className={styles.group}>
        <button
          onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
          title="표 삽입">
          표
        </button>

        {editor.isActive('table') && (
          <>
            <button onClick={() => editor.chain().focus().addColumnBefore().run()} title="열 추가(앞)">
              ←+
            </button>

            <button onClick={() => editor.chain().focus().addColumnAfter().run()} title="열 추가(뒤)">
              +→
            </button>

            <button onClick={() => editor.chain().focus().deleteColumn().run()} title="열 삭제">
              ←✕→
            </button>

            <button onClick={() => editor.chain().focus().addRowBefore().run()} title="행 추가(위)">
              ↑+
            </button>

            <button onClick={() => editor.chain().focus().addRowAfter().run()} title="행 추가(아래)">
              +↓
            </button>

            <button onClick={() => editor.chain().focus().deleteRow().run()} title="행 삭제">
              ↕✕
            </button>

            <button onClick={() => editor.chain().focus().deleteTable().run()} title="표 삭제">
              표✕
            </button>
          </>
        )}
      </div>

      <div className={styles.divider} />

      {/* 위첨자/아래첨자 */}
      <div className={styles.group}>
        <button
          onClick={() => editor.chain().focus().toggleSuperscript().run()}
          className={editor.isActive('superscript') ? styles.active : ''}
          title="위첨자">
          X<sup>2</sup>
        </button>

        <button
          onClick={() => editor.chain().focus().toggleSubscript().run()}
          className={editor.isActive('subscript') ? styles.active : ''}
          title="아래첨자">
          X<sub>2</sub>
        </button>
      </div>

      <div className={styles.divider} />

      {/* 링크 */}
      <div className={styles.group}>
        <button
          onClick={() => {
            const url = window.prompt('URL을 입력하세요:');
            if (url) {
              editor.chain().focus().setLink({ href: url }).run();
            }
          }}
          className={editor.isActive('link') ? styles.active : ''}
          title="링크 추가">
          🔗
        </button>

        <button
          onClick={() => editor.chain().focus().unsetLink().run()}
          disabled={!editor.isActive('link')}
          title="링크 제거">
          🔗✕
        </button>
      </div>
    </div>
  );
}

export default EditorToolbar;
