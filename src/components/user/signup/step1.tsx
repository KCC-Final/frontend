'use client';

import { useShallow } from 'zustand/shallow';

import styles from '@/components/user/signup/signup.module.scss';
import useBoundStore from '@/stores';
import { SignupInputFieldKey } from '@/types';
import { validate } from '@/utils/validation/signup';

type ChangeInputEvent = React.ChangeEvent<HTMLInputElement>;

function SignupStep1() {
  // 회원가입 저장소의 state 및 actions 불러오기
  const { userId, password1, password2, nickname, idVerification, setIdVerification, setSignupInputField } =
    useBoundStore(
      useShallow((state) => ({
        userId: state.signupInputField.userId,
        password1: state.signupInputField.password1,
        password2: state.signupInputField.password2,
        nickname: state.signupInputField.nickname,
        setSignupInputField: state.setSignupInputField,
        idVerification: state.signupIdVerification,
        setIdVerification: state.setSignupIdVerification
      }))
    );

  /**
   * type = text인 input태그의 ChangeEventHandler
   */
  const changeInputHandler = (field: SignupInputFieldKey) => (event: ChangeInputEvent) => {
    setSignupInputField(field, event.target.value);
  };

  /**
   * input에 입력된 userId값을 이용하여 아이디 중복확인 요청 버튼
   */
  const verifyUserId = () => {
    // TODO: 아이디 중복확인 처리 필요
    if (Math.random() < 0.5) {
      setIdVerification({
        isLoading: false,
        isSuccess: true,
        userId: userId,
        message: '사용 가능한 아이디입니다.'
      });
    } else {
      setIdVerification({
        isLoading: false,
        isSuccess: false,
        userId: userId,
        message: '이미 사용중인 아이디입니다.'
      });
    }
  };

  return (
    <>
      <div className={styles.id}>
        <div>아이디</div>
        <label>
          <input
            type="text"
            name="userId"
            value={userId}
            onChange={changeInputHandler('userId')}
            placeholder="아이디를 입력해주세요."
          />
          <button type="button" onClick={verifyUserId}>
            확인
          </button>
        </label>
        {idVerification.message && (
          <div className={`${styles.message} ${idVerification.isSuccess ? styles.success : styles.fail}`}>
            {idVerification.message}
          </div>
        )}
      </div>
      <div className={styles.pw}>
        <div>비밀번호</div>
        <input
          type="password"
          name="password1"
          value={password1}
          onChange={changeInputHandler('password1')}
          placeholder="비밀번호를 입력해주세요."
        />
        {password1 && !validate.password(password1).result && (
          <div className={`${styles.message} ${styles.fail}`}>{validate.password(password1).message}</div>
        )}
        <input
          type="password"
          name="password2"
          value={password2}
          onChange={changeInputHandler('password2')}
          placeholder="비밀번호를 다시 한번 입력해주세요."
        />
        {password2 && !validate.passwordConfirm(password1, password2).result && (
          <div className={`${styles.message} ${styles.fail}`}>
            {validate.passwordConfirm(password1, password2).message}
          </div>
        )}
      </div>
      <div className={styles.nickname}>
        <div>닉네임</div>
        <input
          type="text"
          name="nickname"
          value={nickname}
          onChange={changeInputHandler('nickname')}
          placeholder="닉네임을 입력해주세요."
        />
        {nickname && !validate.nickname(nickname).result && (
          <div className={`${styles.message} ${styles.fail}`}>{validate.nickname(nickname).message}</div>
        )}
      </div>
    </>
  );
}

export default SignupStep1;
