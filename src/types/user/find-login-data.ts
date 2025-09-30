// ID/PW 찾기 단계
export type FindLoginDataStep = 1 | 2 | 3;

// 아이디 찾기
export type FindId = {
  isSuccess: boolean;
  userId: string;
};

// ID/PW 찾기 스토어 state
export interface FindLoginDataState {
  findLoginDataStep: FindLoginDataStep; // ID/PW 찾기 단계
  findId: FindId; // 아이디 찾기
}

// ID/PW 찾기 스토어 actions
export interface FindLoginDataActions {
  // 정보 찾기 단계 변경 함수
  setFindLoginDataStep: (step: FindLoginDataStep) => void;

  // 아이디 찾기 상태 변경
  setFindIdState: (findId: FindId) => void;

  // 스토어 초기화
  resetFindLoginDataState: () => void;
}

export type FindLoginDataSlice = FindLoginDataState & FindLoginDataActions;
