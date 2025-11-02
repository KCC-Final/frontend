import { CommonResDTO } from '@/types';

//types
export type GroupData = {
  groupId: number; // 게시글 ID
  groupName: string; // 모임명
  bookTitle: string; // 도서 제목
  isbn?: string; // isbn
  headcountMin: number; // 최소 인원
  headcountMax: number; // 최대 인원
  content: string; // 내용
  style: '독서' | '토론' | '자유'; // 진행 방식
  status: boolean; // 모집 상태
  endDate: string; // 모집 종료일
  createdAt: string; // 작성일
  updatedAt: string; // 수정일
  userId: string; // 작성자 ID
  codeId: number; // 지역 코드 ID
  coverUrl?: string;
  author?: string;
  region?: string;
  nickname?: string;
};

export type GroupCommentData = {
  commentId: number; // 댓글 ID
  content: string; // 댓글 내용
  createdAt: string; // 작성일
  updatedAt: string; // 수정일
  flag: boolean; // 비밀댓글 여부
  groupId: number; // 게시글 ID
  userId: string; // 작성자 ID
  parentId: number | null; // 부모 댓글 ID
  isOwner?: boolean; // 로그인 사용자가 작성자인지 여부
  authorNickname?: string; // 작성자 닉네임
  authorProfileImage?: string | null; // 작성자 프로필 이미지
};

export type GroupScrapData = {
  userId: string; // 사용자 ID
  groupId: number; // 게시글 ID
  createdAt: string; // 스크랩 일시
};

//RequestDTO
export type GroupRequestBody = {
  groupName: string;
  bookTitle: string;
  isbn: string;
  headcountMin?: number;
  headcountMax?: number;
  content: string;
  style: '독서' | '토론' | '자유';
  status: boolean;
  endDate: string;
  codeId: number;
};

export type GroupCommentRequestBody = {
  content: string;
  flag: boolean;
  parentId?: number;
};

//ResponseDTO
//create group / update group / delete group
export type GroupMutateResDTO = CommonResDTO<null>;

//group list
export type GroupListResDTO = CommonResDTO<{
  groups: GroupData[];
  count: number;
}>;

//group detail
export type GroupDetailResDTO = CommonResDTO<{
  group: GroupData;
  comments: GroupCommentData[];
  scrap: {
    isScrapped: boolean;
    count: number;
  };
}>;

//create comment / update comment / delete comment
export type GroupCommentResDTO = CommonResDTO<null>;

//create scrap / delete scrap
export type GroupScrapResDTO = CommonResDTO<boolean>;

//scrap list
export type GroupScrapListResDTO = CommonResDTO<GroupData[]>;
