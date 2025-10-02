import { Editor } from '@tiptap/react';

// 에디터 설정
export type EditorConfig = {
  placeholder?: string;
  minHeight?: string;
  maxHeight?: string;
};

// 에디터 툴바 props
export type EditorToolbarProps = {
  editor: Editor | null;
};

// 에디터 콘텐츠 타입
export type EditorContent = {
  html: string;
  text: string;
  isEmpty: boolean;
};
