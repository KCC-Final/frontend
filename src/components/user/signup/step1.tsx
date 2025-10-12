'use client';

import { useShallow } from 'zustand/shallow';

import BasicButton from '@/components/layout/button/basic';
import BasicInputContainer from '@/components/layout/input/basic/container';
import BasicInputField from '@/components/layout/input/basic/field';
import BasicInputMessage from '@/components/layout/input/basic/message';
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
      <BasicInputContainer labelName="아이디">
        <BasicInputField
          inputType="text"
          inputPlaceholder="아이디를 입력해주세요."
          inputValue={userId}
          inputChange={changeInputHandler('userId')}
          additionalButton={<BasicButton name="확인" handler={verifyUserId} />}
          isError={!!userId && idVerification.isSuccess === false}
        />
        <BasicInputMessage message={idVerification.message} status={idVerification.isSuccess} />
      </BasicInputContainer>
      <BasicInputContainer labelName="비밀번호">
        <BasicInputField
          inputType="password"
          inputPlaceholder="비밀번호를 입력해주세요."
          inputValue={password1}
          inputChange={changeInputHandler('password1')}
          isError={!!password1 && !validate.password(password1).result}
        />
        {password1 && <BasicInputMessage message={validate.password(password1).message} status={false} />}
        <BasicInputField
          inputType="password"
          inputPlaceholder="비밀번호를 다시 한번 입력해주세요."
          inputValue={password2}
          inputChange={changeInputHandler('password2')}
          isError={!!password2 && !validate.passwordConfirm(password1, password2).result}
        />
        {password2 && (
          <BasicInputMessage
            message={validate.passwordConfirm(password1, password2).message}
            status={false}
          />
        )}
      </BasicInputContainer>
      <BasicInputContainer labelName="닉네임">
        <BasicInputField
          inputType="text"
          inputPlaceholder="닉네임을 입력해주세요."
          inputValue={nickname}
          inputChange={changeInputHandler('nickname')}
          isError={!!nickname && !validate.nickname(nickname).result}
        />
        {nickname && <BasicInputMessage message={validate.nickname(nickname).message} status={false} />}
      </BasicInputContainer>
    </>
  );
}

export default SignupStep1;
