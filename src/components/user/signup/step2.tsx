'use client';

import { useShallow } from 'zustand/shallow';

import styles from '@/components/user/signup/signup.module.scss';
import useBoundStore from '@/stores';
import { SignupInputFieldKey } from '@/types';
import { validate } from '@/utils/validation/signup';

type ChangeInputEvent = React.ChangeEvent<HTMLInputElement>;

function SignupStep2() {
  // 회원가입 저장소의 state 및 actions 불러오기
  const { email, emailVerificationCode, setSignupInputField, setEmailVerification } = useBoundStore(
    useShallow((state) => ({
      email: state.signupInputField.email,
      emailVerificationCode: state.signupInputField.emailVerificationCode,
      setSignupInputField: state.setSignupInputField,
      setEmailVerification: state.setSignupEmailVerification
    }))
  );

  /**
   * type = text인 input태그의 ChangeEventHandler
   */
  const changeInputHandler = (field: SignupInputFieldKey) => (event: ChangeInputEvent) => {
    setSignupInputField(field, event.target.value);
  };

  /**
   * input에 입력된 email값을 이용하여 이메일 인증코드 전송 요청 버튼
   */
  const sendVerificationCode = () => {
    // TODO: 이메일 확인요청 처리 필요
    if (!validate.email(email).result) {
      alert(validate.email(email).message);
    } else {
      alert(`${email}로 인증번호를 전송하였습니다.`);
    }
  };

  /**
   * input에 입력된 emailVerificationCode값을 이용하여 이메일 인증확인 요청 버튼
   */
  const verifyEmailCode = () => {
    // TODO: 이메일 확인요청 처리 필요
    if (Math.random() < 0.5) {
      setEmailVerification({
        isLoading: false,
        isSuccess: true,
        email: email,
        message: '이메일 인증에 성공했습니다.'
      });
      alert('이메일 인증에 성공했습니다.');
    } else {
      setEmailVerification({
        isLoading: false,
        isSuccess: false,
        email: email,
        message: '인증코드가 일치하지 않습니다.'
      });
      alert('인증코드가 일치하지 않습니다.');
    }
  };

  return (
    <>
      <div className={styles.email}>
        <div>이메일</div>
        <label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={changeInputHandler('email')}
            placeholder="이메일을 입력해주세요."
          />
          <button type="button" onClick={sendVerificationCode}>
            인증요청
          </button>
        </label>
        <label>
          <input
            type="text"
            name="emailVerificationCode"
            value={emailVerificationCode}
            onChange={changeInputHandler('emailVerificationCode')}
            placeholder="인증코드를 입력해주세요."
          />
          <button type="button" onClick={verifyEmailCode}>
            확인
          </button>
        </label>
      </div>
    </>
  );
}

export default SignupStep2;
