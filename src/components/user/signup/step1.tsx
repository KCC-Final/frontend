'use client';

import { useEffect, useState } from 'react';

import type { Step } from '@/components/user/signup/index';
import styles from '@/components/user/signup/signup.module.scss';
import { validate } from '@/utils/validation';

import type { Dispatch, SetStateAction } from 'react';

interface SignupStep1Props {
  setStep: Dispatch<SetStateAction<Step>>;
  userId: string;
  changeUserId: React.ChangeEventHandler<HTMLInputElement>;
  password: string;
  changePassword: React.ChangeEventHandler<HTMLInputElement>;
  password2: string;
  changePassword2: React.ChangeEventHandler<HTMLInputElement>;
  nickname: string;
  changeNickname: React.ChangeEventHandler<HTMLInputElement>;
}

interface IdVerification {
  userId: string;
  result: boolean | null;
  message: string;
}

function SignupStep1({
  setStep,
  userId,
  changeUserId,
  password,
  changePassword,
  password2,
  changePassword2,
  nickname,
  changeNickname
}: SignupStep1Props) {
  // 아이디 중복확인, 비밀번호 일치확인
  const [idVerification, setIdVerification] = useState<IdVerification>({
    userId: '',
    result: null,
    message: ''
  });

  /**
   * input에 입력된 userId값을 이용하여 아이디 중복확인 요청 버튼
   */
  const verifyUserId = () => {
    // TODO: 아이디 중복확인 처리 필요
    if (Math.random() < 0.5) {
      setIdVerification({ userId: userId, result: true, message: '사용 가능한 아이디입니다.' });
    } else {
      setIdVerification({ userId: userId, result: false, message: '이미 사용중인 아이디입니다.' });
    }
  };

  // 회원가입 2단계로 이동 전 아이디, 비밀번호, 닉네임 확인
  useEffect(() => {
    if (!validate.userId(userId).result) {
      setStep({ value: 1, canNextStep: false, reason: validate.userId(userId).message });
      return;
    } else if (idVerification.userId !== userId || !idVerification.result) {
      setStep({ value: 1, canNextStep: false, reason: '중복확인이 필요합니다.' });
      return;
    } else if (!validate.password(password).result) {
      setStep({ value: 1, canNextStep: false, reason: validate.password(password).message });
      return;
    } else if (!validate.passwordConfirm(password, password2).result) {
      setStep({
        value: 1,
        canNextStep: false,
        reason: validate.passwordConfirm(password, password2).message
      });
      return;
    } else if (!validate.nickname(nickname).result) {
      setStep({ value: 1, canNextStep: false, reason: validate.nickname(nickname).message });
      return;
    } else {
      setStep({ value: 1, canNextStep: true, reason: '' });
      return;
    }
  }, [userId, idVerification, password, password2, nickname]);

  return (
    <>
      <div className={styles.id}>
        <div>아이디</div>
        <label>
          <input
            type="text"
            name="userId"
            value={userId}
            onChange={changeUserId}
            placeholder="아이디를 입력해주세요."
          />
          <button type="button" onClick={verifyUserId}>
            확인
          </button>
        </label>
        {idVerification.message && (
          <div
            className={`${styles.message} ${idVerification.result ? styles.success : styles.fail}`}>
            {idVerification.message}
          </div>
        )}
      </div>
      <div className={styles.pw}>
        <div>비밀번호</div>
        <input
          type="password"
          name="password"
          value={password}
          onChange={changePassword}
          placeholder="비밀번호를 입력해주세요."
        />
        {password && !validate.password(password).result && (
          <div className={`${styles.message} ${styles.fail}`}>
            {validate.password(password).message}
          </div>
        )}
        <input
          type="password"
          name="password2"
          value={password2}
          onChange={changePassword2}
          placeholder="비밀번호를 다시 한번 입력해주세요."
        />
        {password2 && !validate.passwordConfirm(password, password2).result && (
          <div className={`${styles.message} ${styles.fail}`}>
            {validate.passwordConfirm(password, password2).message}
          </div>
        )}
      </div>
      <div className={styles.nickname}>
        <div>닉네임</div>
        <input
          type="text"
          name="nickname"
          value={nickname}
          onChange={changeNickname}
          placeholder="닉네임을 입력해주세요."
        />
        {nickname && !validate.nickname(nickname).result && (
          <div className={`${styles.message} ${styles.fail}`}>
            {validate.nickname(nickname).message}
          </div>
        )}
      </div>
    </>
  );
}

export default SignupStep1;
