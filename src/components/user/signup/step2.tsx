'use client';

import { useShallow } from 'zustand/shallow';

import { fetchGroo } from '@/apis';
import BasicButton from '@/components/layout/button/basic';
import BasicInputContainer from '@/components/layout/input/basic/container';
import BasicInputField from '@/components/layout/input/basic/field';
import useBoundStore from '@/stores';
import { SignupInputFieldKey } from '@/types';
import { devLogger } from '@/utils/dev-logger';
import { ApiError } from '@/utils/error/api';
import { validate } from '@/utils/validation/signup';

type ChangeInputEvent = React.ChangeEvent<HTMLInputElement>;

function SignupStep2() {
  // 회원가입 저장소의 state 및 actions 불러오기
  const { email, emailVerificationCode, emailVerification, setSignupInputField, setEmailVerification } =
    useBoundStore(
      useShallow((state) => ({
        email: state.signupInputField.email,
        emailVerificationCode: state.signupInputField.emailVerificationCode,
        emailVerification: state.signupEmailVerification,
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
  const sendVerificationCode = async () => {
    try {
      if (!validate.email(email).result) {
        alert(validate.email(email).message);
      } else {
        const result = await fetchGroo.user.sendEmailCode({ purpose: 'signup', email: email });
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
        purpose: 'signup',
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

  return (
    <>
      <BasicInputContainer labelName="이메일">
        <BasicInputField
          inputType="email"
          inputPlaceholder="이메일을 입력해주세요."
          inputValue={email}
          inputChange={changeInputHandler('email')}
          additionalButton={<BasicButton name="인증요청" handler={sendVerificationCode} />}
        />
        <BasicInputField
          inputType="text"
          inputPlaceholder="인증코드를 입력해주세요."
          inputValue={emailVerificationCode}
          inputChange={changeInputHandler('emailVerificationCode')}
          additionalButton={<BasicButton name="확인" handler={verifyEmailCode} />}
        />
      </BasicInputContainer>
    </>
  );
}

export default SignupStep2;
