import { useRouter } from 'next/navigation';
import { useShallow } from 'zustand/shallow';

import { fetchGroo } from '@/apis';
import BasicInputContainer from '@/components/layout/input/basic/container';
import BasicInputField from '@/components/layout/input/basic/field';
import BasicInputMessage from '@/components/layout/input/basic/message';
import styles from '@/components/user/find-login-data/find-login-data.module.scss';
import { useInputText } from '@/hooks/useInput';
import useBoundStore from '@/stores';
import { ApiError } from '@/utils/error/api';
import { validate } from '@/utils/validation/signup';

function FindPassword() {
  const router = useRouter();

  // 로그인 정보 찾기 저장소의 state 및 actions 불러오기
  const { findId } = useBoundStore(useShallow((state) => ({ findId: state.findId })));

  // 비밀번호 재설정 입력 폼의 value에 사용할 값과 onChange에 사용할 함수
  const [password1, changePassword1] = useInputText('');
  const [password2, changePassword2] = useInputText('');

  /**
   * 비밀번호 재설정 버튼
   */
  const changePassword = async () => {
    try {
      await fetchGroo.user.changePassword({
        userId: findId.userId,
        password1: password1,
        password2: password2
      });
      alert('비밀번호가 재설정되었습니다. 로그인 페이지로 이동합니다.');
      router.push('/login');
    } catch (error) {
      if (error instanceof ApiError) {
        alert(error.message);
      } else {
        alert('비밀번호 재설정에 실패하였습니다.');
      }
    }
  };

  return (
    <section className={styles.find_pw}>
      <h1>비밀번호 재설정</h1>
      <form>
        <BasicInputContainer labelName="비밀번호">
          <BasicInputField
            inputType="password"
            inputPlaceholder="비밀번호를 입력해주세요."
            inputValue={password1}
            inputChange={changePassword1}
            isError={!!password1 && !validate.password(password1).result}
          />
          {password1 && <BasicInputMessage message={validate.password(password1).message} status={false} />}
          <BasicInputField
            inputType="password"
            inputPlaceholder="비밀번호를 다시 한번 입력해주세요."
            inputValue={password2}
            inputChange={changePassword2}
            isError={!!password2 && !validate.passwordConfirm(password1, password2).result}
          />
          {password2 && (
            <BasicInputMessage
              message={validate.passwordConfirm(password1, password2).message}
              status={false}
            />
          )}
        </BasicInputContainer>
        <div className={styles.submit}>
          <button type="button" onClick={changePassword}>
            비밀번호 재설정
          </button>
        </div>
      </form>
    </section>
  );
}

export default FindPassword;
