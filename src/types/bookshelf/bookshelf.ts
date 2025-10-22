export interface Bookshelf {
  bookshelfId: number;
  name: string;
  createdAt: string;
  updatedAt: string | null;
  userId: string;
}

export interface BookScrap {
  ISBN: string;
  bookshelfId: number;
  createdAt: string;
}

export interface BookInfo {
  ISBN: string;
  title: string;
  author: string;
  cover: string;
  publisher: string;
  pubDate: string;
  description?: string;
}

export interface BookshelfRequest {
  name: string;
}

export interface BookScrapRequest {
  ISBN: string; // 소문자로 변경
  bookshelfId: number;
}
