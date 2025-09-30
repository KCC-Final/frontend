import { AladinBook, LibraryBook } from './book-search';

// 독후감 작성 폼 데이터
export type ReviewFormData = {
  selectedBook: AladinBook | null;
  libraryBook: LibraryBook | null;
  codeId: number | null;
  title: string;
  content: string;
  isSecret: boolean;
};

// 독후감 작성 단계
export type ReviewCreateStep = 'book-select' | 'writing' | 'preview';

// 임시저장 상태
export type DraftSaveState = {
  isSaving: boolean;
  lastSavedAt: string | null;
  error: string | null;
};

// 모달 상태
export type ModalState = {
  isBookSearchOpen: boolean;
  isDraftListOpen: boolean;
};
