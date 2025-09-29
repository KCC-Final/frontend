'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useShallow } from 'zustand/shallow';

import { fetchGroo } from '@/apis';
import styles from '@/components/user/find-id.module.scss';
import { useInputText } from '@/hooks/useInput';
import useBoundStore from '@/stores';
import { EmailVerification } from '@/types';
import { devLogger } from '@/utils/dev-logger';
import { ApiError } from '@/utils/error/api';
import { validate } from '@/utils/validation/signup';

function FindLoginId() {
  const router = useRouter();

  // 아이디 찾기 저장소의 state 및 actions 불러오기
  const { setFindIdState } = useBoundStore(useShallow((state) => ({ setFindIdState: state.setFindIdState })));

  // 아이디 찾기 입력 폼의 value에 사용할 값과 onChange에 사용할 함수
  const [name, changeName] = useInputText('');
  const [email, changeEmail] = useInputText('');
  const [emailVerificationCode, changeEmailVerificationCode] = useInputText('');

  // 이메일 인증결과
  const [emailVerification, setEmailVerification] = useState<EmailVerification>({
    isLoading: false,
    isSuccess: null,
    email: '',
    message: ''
  });

  /**
   * input에 입력된 email값을 이용하여 이메일 인증코드 전송 요청 버튼
   */
  const sendVerificationCode = async () => {
    try {
      if (!validate.email(email).result) {
        alert(validate.email(email).message);
      } else {
        const result = await fetchGroo.user.sendEmailCode({ purpose: 'findId', email: email });
        alert(`${email}로 인증코드를 전송하였습니다.`);
        devLogger(`${email}로 인증코드 ${result.data}를 전송하였습니다.`); // TODO: 개발환경 인증코드 전송내역 출력 코드 제거 필요
      }
    } catch (error) {
      if (error instanceof ApiError) {
        alert(error.message);
      } else {
        alert('인증코드 전송에 실패하였습니다.');
      }
    }
  };

  /**
   * input에 입력된 emailVerificationCode값을 이용하여 이메일 인증확인 요청 버튼
   */
  const verifyEmailCode = async () => {
    try {
      const result = await fetchGroo.user.verifyEmail({
        purpose: 'findId',
        email: email,
        code: emailVerificationCode
      });
      if (email === result.data) {
        setEmailVerification({
          isLoading: false,
          isSuccess: true,
          email: email,
          message: `이메일 ${email}는 인증에 성공했습니다.`
        });
      } else {
        setEmailVerification({
          isLoading: false,
          isSuccess: false,
          email: email,
          message: '현재 작성하신 email과 인증한 이메일이 일치하지 않습니다.'
        });
      }
      alert(emailVerification.message);
    } catch (error) {
      if (error instanceof ApiError) {
        alert(error.message);
      } else {
        alert('이메일 인증에 실패하였습니다.');
      }
    }
  };

  const findId = async () => {
    try {
      const result = await fetchGroo.user.findId({ name: name, email: email });
      devLogger(result.data); // TODO: 개발 테스트용 로그 삭제 필요
      alert('아이디 찾기에 성공했습니다. 비밀번호 재설정 페이지로 이동합니다.');
      setFindIdState({ findIdisSuccess: true, findIdResult: result.data });
      router.replace('/login/find-pw');
    } catch (error) {
      setFindIdState({ findIdisSuccess: false, findIdResult: '' });
      if (error instanceof ApiError) {
        alert(error.message);
      } else {
        alert('이메일 인증에 실패하였습니다.');
      }
    }
  };

  return (
    <section className={styles.find_id}>
      <h1>아이디 찾기/비밀번호 재설정</h1>
      <form>
        <div className={styles.name}>
          <div>이름</div>
          <input
            type="text"
            name="name"
            value={name}
            onChange={changeName}
            placeholder="이름을 입력해주세요."
          />
        </div>
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
        <div className={styles.submit}>
          <button type="button" onClick={findId}>
            아이디 찾기
          </button>
        </div>
      </form>
    </section>
  );
}

export default FindLoginId;
