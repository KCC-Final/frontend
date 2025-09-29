// 아이디 찾기 스토어 state
export interface FindIdState {
  findIdisSuccess: boolean; // 아이디 찾기 성공 여부
  findIdResult: string; // 찾은 아이디
}

// 회원가입 스토어 actions
export interface FindIdActions {
  // 아이디 찾기 상태 변경
  setFindIdState: (result: FindIdState) => void;
  resetFindIdState: () => void;
}

export type FindIdSlice = FindIdState & FindIdActions;
