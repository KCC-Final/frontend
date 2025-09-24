'use client';

import { useEffect, useState } from 'react';

import type { Step } from '@/components/user/signup/index';
import styles from '@/components/user/signup/signup.module.scss';
import { useInputText } from '@/hooks/useInput';
import { validate } from '@/utils/validation';

import type { Dispatch, SetStateAction } from 'react';

interface SignupStep1Props {
  setStep: Dispatch<SetStateAction<Step>>;
  email: string;
  changeEmail: React.ChangeEventHandler<HTMLInputElement>;
}

interface EmailVerification {
  email: string;
  result: boolean | null;
}

function SignupStep2({ setStep, email, changeEmail }: SignupStep1Props) {
  // 회원가입 입력 폼의 value에 사용할 값과 onChange에 사용할 함수

  const [emailVerificationCode, changeEmailVerificationCode] = useInputText('');

  // 이메일 인증성공 여부
  const [emailVerification, setEmailVerification] = useState<EmailVerification>({
    email: '',
    result: null
  });

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
      setEmailVerification({ email: email, result: true });
      alert('이메일 인증에 성공했습니다.');
    } else {
      setEmailVerification({ email: email, result: false });
      alert('인증코드가 일치하지 않습니다.');
    }
  };

  // 회원가입 3단계로 이동 전 이메일, 이메일 인증 결과 확인
  useEffect(() => {
    if (!validate.email(email).result) {
      setStep({ value: 2, canNextStep: false, reason: validate.email(email).message });
      return;
    } else if (emailVerification.email !== email || !emailVerification.result) {
      setStep({ value: 2, canNextStep: false, reason: '이메일 인증이 필요합니다.' });
      return;
    } else {
      setStep({ value: 2, canNextStep: true, reason: '' });
      return;
    }
  }, [email, emailVerification]);

  return (
    <>
      <div className={styles.email}>
        <div>이메일</div>
        <label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={changeEmail}
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
            onChange={changeEmailVerificationCode}
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
