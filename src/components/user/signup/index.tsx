'use client';

import { useState } from 'react';

import SignupButton from './button';

import styles from '@/components/user/signup/signup.module.scss';
import SignupStep1 from '@/components/user/signup/step1';
import SignupStep2 from '@/components/user/signup/step2';
import SignupStep3 from '@/components/user/signup/step3';
import { useCheckbox, useInputText, useSelectText } from '@/hooks/useInput';

export interface Step {
  value: 1 | 2 | 3;
  canNextStep: boolean;
  reason: string;
}

function Signup() {
  // 회원가입 단계관리
  const [step, setStep] = useState<Step>({ value: 1, canNextStep: false, reason: '' });

  // 회원가입 입력 폼의 value에 사용할 값과 onChange에 사용할 함수
  const [userId, changeUserId] = useInputText('');
  const [password, changePassword] = useInputText('');
  const [password2, changePassword2] = useInputText('');
  const [nickname, changeNickname] = useInputText('');
  const [email, changeEmail] = useInputText('');
  const [name, changeName] = useInputText('');
  const [gender, changeGender] = useInputText('');
  const [birthYear, changeBirthYear] = useSelectText('');
  const [birthMonth, changeBirthMonth] = useSelectText('');
  const [birthDay, changeBirthDay, setBirthDay] = useSelectText('');
  const [checkService, changeCheckService, setCheckService] = useCheckbox(false);
  const [checkPrivacy, changeCheckPrivacy, setCheckPrivacy] = useCheckbox(false);

  /**
   * 회원가입 다음단계로 진행 또는 회원가입 요청을 하기 위한 버튼
   */
  const mainButtonHandler = () => {
    // TODO: 다음단계로 넘어가기 위해 필요한 로직 구현
    if (step.value === 1) {
      if (step.canNextStep) {
        setStep({ value: 2, canNextStep: false, reason: '' });
      } else {
        alert(step.reason);
      }
    } else if (step.value === 2) {
      if (step.canNextStep) {
        setStep({ value: 3, canNextStep: false, reason: '' });
      } else {
        alert(step.reason);
      }
    } else {
      if (step.canNextStep) {
        alert('회원가입 요청 (내용은 콘솔창)');
        console.log({
          userId: userId,
          password1: password,
          password2: password2,
          nickname: nickname,
          email: email,
          name: name,
          gender: gender,
          birth: `${birthYear}-${birthMonth}-${birthDay}`,
          checkService: checkService,
          checkPrivacy: checkPrivacy
        });
      } else {
        alert(step.reason);
      }
    }
  };

  return (
    <section className={styles.signup}>
      <h1>회원가입</h1>
      <form>
        {step.value === 1 && (
          <>
            <SignupStep1
              setStep={setStep}
              userId={userId}
              changeUserId={changeUserId}
              password={password}
              changePassword={changePassword}
              password2={password2}
              changePassword2={changePassword2}
              nickname={nickname}
              changeNickname={changeNickname}
            />
            <SignupButton handler={mainButtonHandler} name="다음 단계로" />
          </>
        )}
        {step.value === 2 && (
          <>
            <SignupStep2 setStep={setStep} email={email} changeEmail={changeEmail} />
            <SignupButton handler={mainButtonHandler} name="다음 단계로" />
          </>
        )}
        {step.value === 3 && (
          <>
            <SignupStep3
              setStep={setStep}
              name={name}
              changeName={changeName}
              gender={gender}
              changeGender={changeGender}
              birthYear={birthYear}
              changeBirthYear={changeBirthYear}
              birthMonth={birthMonth}
              changeBirthMonth={changeBirthMonth}
              birthDay={birthDay}
              changeBirthDay={changeBirthDay}
              setBirthDay={setBirthDay}
              checkService={checkService}
              changeCheckService={changeCheckService}
              setCheckService={setCheckService}
              checkPrivacy={checkPrivacy}
              changeCheckPrivacy={changeCheckPrivacy}
              setCheckPrivacy={setCheckPrivacy}
            />
            <SignupButton handler={mainButtonHandler} name="가입하기" />
          </>
        )}
      </form>
    </section>
  );
}

export default Signup;
