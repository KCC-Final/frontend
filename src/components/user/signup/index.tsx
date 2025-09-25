'use client';

import { useShallow } from 'zustand/shallow';

import SignupButton from '@/components/user/signup/button';
import styles from '@/components/user/signup/signup.module.scss';
import SignupStep1 from '@/components/user/signup/step1';
import SignupStep2 from '@/components/user/signup/step2';
import SignupStep3 from '@/components/user/signup/step3';
import useBoundStore from '@/stores';

function Signup() {
  // 회원가입 저장소의 state 및 actions 불러오기
  const { step, setStep, signupInputField, signupValidateAndVerifyField } = useBoundStore(
    useShallow((state) => ({
      step: state.signupStep,
      setStep: state.setSignupStep,
      signupInputField: state.signupInputField,
      signupValidateAndVerifyField: state.signupValidateAndVerifyField
    }))
  );

  /**
   * 회원가입 다음단계로 진행 또는 회원가입 요청을 하기 위한 버튼
   */
  const mainButtonHandler = () => {
    // TODO: 다음단계로 넘어가기 위해 필요한 로직 구현
    if (step === 1) {
      if (signupValidateAndVerifyField().isSuccess) {
        setStep(2);
      } else {
        alert(signupValidateAndVerifyField().message);
      }
    } else if (step === 2) {
      if (signupValidateAndVerifyField().isSuccess) {
        setStep(3);
      } else {
        alert(signupValidateAndVerifyField().message);
      }
    } else {
      if (signupValidateAndVerifyField().isSuccess) {
        alert('회원가입 요청 예정(요청body는 임시로 콘솔창 출력)');
        console.log({
          userId: signupInputField.userId,
          password1: signupInputField.password1,
          password2: signupInputField.password2,
          nickname: signupInputField.nickname,
          email: signupInputField.email,
          name: signupInputField.name,
          gender: signupInputField.gender,
          birth: `${signupInputField.birthYear}-${signupInputField.birthMonth}-${signupInputField.birthDay}`,
          checkService: signupInputField.isCheckedService,
          checkPrivacy: signupInputField.isCheckedPrivacy
        });
      } else {
        alert(signupValidateAndVerifyField().message);
      }
    }
  };

  return (
    <section className={styles.signup}>
      <h1>회원가입</h1>
      <form>
        {step === 1 && (
          <>
            <SignupStep1 />
            <SignupButton handler={mainButtonHandler} name="다음단계로" />
          </>
        )}
        {step === 2 && (
          <>
            <SignupStep2 />
            <SignupButton handler={mainButtonHandler} name="다음단계로" />
          </>
        )}
        {step === 3 && (
          <>
            <SignupStep3 />
            <SignupButton handler={mainButtonHandler} name="가입하기" />
          </>
        )}
      </form>
    </section>
  );
}

export default Signup;
