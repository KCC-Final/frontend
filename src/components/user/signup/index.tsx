'use client';

import { useRouter } from 'next/navigation';
import { useShallow } from 'zustand/shallow';

import { fetchGroo } from '@/apis';
import BasicButton from '@/components/layout/button/basic';
import LoginBackButton from '@/components/user/back-button';
import styles from '@/components/user/signup/signup.module.scss';
import SignupStep1 from '@/components/user/signup/step1';
import SignupStep2 from '@/components/user/signup/step2';
import SignupStep3 from '@/components/user/signup/step3';
import useBoundStore from '@/stores';
import { ApiError } from '@/utils/error/api';

function Signup() {
  const router = useRouter();

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
   * 뒤로가기 버튼
   */
  const backButtonHandler = () => {
    if (step === 1) {
      router.push('/login');
    } else {
      setStep((step - 1) as 1 | 2);
    }
  };

  /**
   * 회원가입 다음단계로 진행 또는 회원가입 요청을 하기 위한 버튼
   */
  const mainButtonHandler = async () => {
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
        try {
          await fetchGroo.user.signup({
            userId: signupInputField.userId,
            password1: signupInputField.password1,
            password2: signupInputField.password2,
            nickname: signupInputField.nickname,
            email: signupInputField.email,
            name: signupInputField.name,
            gender: signupInputField.gender as 'm' | 'f',
            birth: `${signupInputField.birthYear}-${signupInputField.birthMonth}-${signupInputField.birthDay}`,
            checkService: signupInputField.isCheckedService,
            checkPrivacy: signupInputField.isCheckedPrivacy
          });
          alert('회원가입에 성공했습니다. 로그인 페이지로 이동합니다.');
          router.replace('/login');
        } catch (error) {
          if (error instanceof ApiError) {
            alert(error.message);
          } else {
            alert('회원가입에 실패했습니다.');
          }
        }
      } else {
        alert(signupValidateAndVerifyField().message);
      }
    }
  };

  return (
    <>
      <LoginBackButton onClick={backButtonHandler} />
      <section className={styles.signup}>
        <h1>회원가입</h1>
        <form>
          {step === 1 && <SignupStep1 />}
          {step === 2 && <SignupStep2 />}
          {step === 3 && <SignupStep3 />}
          <BasicButton
            name={step === 3 ? '가입하기' : '다음 단계로'}
            handler={mainButtonHandler}
            width="grow"
            height="48"
          />
        </form>
      </section>
    </>
  );
}

export default Signup;
