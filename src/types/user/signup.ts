// 회원가입 단계
export type SignupStep = 1 | 2 | 3;

// 회원가입 사용자 입력 정보
export type SignupInputField = {
  userId: string; // 아이디
  password1: string; // 비밀번호
  password2: string; // 비밀번호 확인
  nickname: string; // 닉네임
  email: string; // 이메일
  emailVerificationCode: string; // 이메일 인증코드
  name: string; // 이름
  gender: 'm' | 'f' | ''; //성별
  birthYear: string; // 출생년도
  birthMonth: string; //출생월
  birthDay: string; //출생일
  isCheckedAllTerms: boolean; // 모든 약관 동의
  isCheckedService: boolean; //서비스 이용 약관 동의
  isCheckedPrivacy: boolean; // 개인정보 수집 약관 동의
};
export type SignupInputFieldKey = keyof SignupState['signupInputField'];

// 회원가입 아이디 중복확인
export type SignupIdVerification = {
  isLoading: boolean;
  isSuccess: boolean | null;
  userId: string;
  message: string;
};

// 회원가입 이메일 인증결과
export type EmailVerification = {
  isLoading: boolean;
  isSuccess: boolean | null;
  email: string;
  message: string;
};

// 회원가입 스토어 state
export interface SignupState {
  // 회원가입 단계 구분
  signupStep: SignupStep;

  // 회원가입 사용자 입력값 관리
  signupInputField: SignupInputField;

  // 아이디 중복확인 요청 정보
  signupIdVerification: SignupIdVerification;

  // 이메일 인증 요청 정보
  signupEmailVerification: EmailVerification;
}

// 회원가입 스토어 actions
export interface SignupActions {
  // 회원가입 단계 변경 함수
  setSignupStep: (step: SignupStep) => void;

  // 회원가입 입력값이 변함에 따라 상태를 변경하는 함수
  setSignupInputField: <K extends SignupInputFieldKey>(
    field: K,
    value: SignupState['signupInputField'][K]
  ) => void;

  // 아이디 중복확인, 이메일 인증 결과 반영 함수
  setSignupIdVerification: (verificationStatus: SignupIdVerification) => void;
  setSignupEmailVerification: (verificationStatus: EmailVerification) => void;

  // 회원가입의 입력값 확인
  signupValidateAndVerifyField: () => { isSuccess: boolean | null; message: string };

  // 회원가입 후 상태 초기화 함수
  resetSignupState: () => void;
}

export type SignupSlice = SignupState & SignupActions;
