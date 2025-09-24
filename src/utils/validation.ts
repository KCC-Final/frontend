interface ValidateReturn {
  result: boolean;
  message: string;
}

export const validate = {
  /**
   * 아이디 유효성 검사
   * - 필수 입력
   * - 4~20자
   * - 영문/숫자만 가능
   * @param userId 검사할 아이디
   * @returns { result: boolean, message: string }
   */
  userId: (userId: string): ValidateReturn => {
    if (!userId) {
      return { result: false, message: '아이디는 필수 입력값입니다.' };
    }
    if (userId.length < 4 || userId.length > 20) {
      return { result: false, message: '아이디는 4~20자여야 합니다.' };
    }
    if (!/^[a-zA-Z0-9]+$/.test(userId)) {
      return { result: false, message: '아이디는 영문과 숫자만 사용할 수 있습니다.' };
    }
    return { result: true, message: '' };
  },

  /**
   * 비밀번호 유효성 검사
   * - 필수 입력
   * - 8~20자
   * - 대문자, 소문자, 숫자 각 1개 이상 포함
   * @param password 검사할 비밀번호
   * @returns { result: boolean, message: string }
   */
  password: (password: string): ValidateReturn => {
    if (!password) {
      return { result: false, message: '비밀번호는 필수 입력값입니다.' };
    }
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_\-+=]{8,20}$/;
    if (!passwordRegex.test(password)) {
      return { result: false, message: '비밀번호는 대/소문자, 숫자를 포함한 8~20자여야 합니다.' };
    }
    return { result: true, message: '' };
  },

  /**
   * 비밀번호 확인 유효성 검사
   * - 필수 입력
   * - 원본 비밀번호와 일치 여부
   * @param password 원본 비밀번호
   * @param passwordConfirm 일치 확인 검사할 비밀번호
   * @returns { result: boolean, message: string }
   */
  passwordConfirm: (password: string, passwordConfirm: string): ValidateReturn => {
    if (!passwordConfirm) {
      return { result: false, message: '비밀번호 확인은 필수 입력값입니다.' };
    }
    if (password !== passwordConfirm) {
      return { result: false, message: '비밀번호가 일치하지 않습니다.' };
    }
    return { result: true, message: '' };
  },

  /**
   * 이메일 유효성 검사
   * - 필수 입력
   * - 이메일 형식
   * @param email 검사할 이메일
   * @returns { result: boolean, message: string }
   */
  email: (email: string): ValidateReturn => {
    if (!email) {
      return { result: false, message: '이메일은 필수 입력값입니다.' };
    }
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(email)) {
      return { result: false, message: '올바른 이메일 형식이어야 합니다.' };
    }
    return { result: true, message: '' };
  },

  /**
   * 닉네임 유효성 검사
   * - 필수 입력
   * - 2~15자
   * @param nickName 검사할 닉네임
   * @returns { result: boolean, message: string }
   */
  nickname: (nickName: string): ValidateReturn => {
    if (!nickName) {
      return { result: false, message: '닉네임은 필수 입력값입니다.' };
    }
    if (nickName.length < 2 || nickName.length > 15) {
      return { result: false, message: '닉네임은 2~15자여야 합니다.' };
    }
    return { result: true, message: '' };
  },

  /**
   * 성별 유효성 검사
   * - 필수 선택
   * @param gender 검사할 성별
   * @returns { result: boolean, message: string }
   */
  gender: (gender: string): ValidateReturn => {
    if (!gender) {
      return { result: false, message: '성별은 필수 선택값입니다.' };
    }
    return { result: true, message: '' };
  },

  /**
   * 이름 유효성 검사
   * - 필수 입력
   * - 2~30자
   * @param name 검사할 이름
   * @returns { result: boolean, message: string }
   */
  name: (name: string): ValidateReturn => {
    if (!name) {
      return { result: false, message: '이름은 필수 입력값입니다.' };
    }
    if (name.length < 2 || name.length > 30) {
      return { result: false, message: '이름은 2~30자여야 합니다.' };
    }
    return { result: true, message: '' };
  },

  /**
   * 생년월일 유효성 검사
   * - 필수 입력
   * - 과거 날짜
   * @param birth 검사할 생년월일
   * @returns { result: boolean, message: string }
   */
  birth: (year: string, month: string, day: string): ValidateReturn => {
    if (!(year && month && day)) {
      return { result: false, message: '생년월일은 필수 입력값입니다.' };
    }
    const birth = `${year}-${month}-${day}`;
    const birthDate = new Date(birth);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (birthDate >= today) {
      return { result: false, message: '생년월일은 과거 날짜여야 합니다.' };
    }
    return { result: true, message: '' };
  },

  /**
   * 약관 동의 유효성 검사
   * - 필수 동의
   * @param isChecked 검사할 약관 동의 여부
   * @param agreementName 약관 이름
   * @returns { result: boolean, message: string }
   */
  agreement: (isChecked: boolean, agreementName: string): ValidateReturn => {
    if (!isChecked) {
      return { result: false, message: `${agreementName}에 동의해야 합니다.` };
    }
    return { result: true, message: '' };
  }
};
