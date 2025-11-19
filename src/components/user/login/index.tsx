'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useShallow } from 'zustand/shallow';

import { fetchGroo } from '@/apis';
import BasicButton from '@/components/common/button/basic';
import BasicInputContainer from '@/components/common/input/basic/container';
import BasicInputField from '@/components/common/input/basic/field';
import styles from '@/components/user/login/login.module.scss';
import { useInputText } from '@/hooks/useInput';
import useBoundStore from '@/stores';
import { ApiError } from '@/utils/error/api';

function Login() {
  const router = useRouter();

  // 로그인 성공시 내 정보를 저장하기 위한 액션
  const { setMyInfo } = useBoundStore(useShallow((state) => ({ setMyInfo: state.setMyInfo })));

  // 로그인 입력 폼의 value에 사용할 값과 onChange에 사용할 함수
  const [userId, changeUserId] = useInputText('');
  const [password, changePassword] = useInputText('');

  /**
   * 로그인 요청 처리 함수
   * @param event submit시 자동 할당되는 이벤트
   */
  const loginSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // TODO: alert창 제거 및 로그인 api 연결
    if (!userId) {
      alert('아이디를 입력해주세요.');
      return;
    } else if (!password) {
      alert('비밀번호를 입력해주세요.');
      return;
    } else {
      try {
        await fetchGroo.auth.login({ userId: userId, password: password });
        alert('로그인에 성공했습니다.');
        const user = await fetchGroo.user.getMyInfo();
        setMyInfo(user.data);
        router.push('/');
      } catch (error) {
        if (error instanceof ApiError) {
          alert(error.message);
        } else {
          alert('로그인에 실패했습니다..');
        }
      }
    }
  };

  return (
    <section className={styles.login}>
      <h1 hidden>로그인</h1>
      <h2>
        <p>일상을 심다</p>
        <p>독서 경험의 모든 것</p>
      </h2>
      <form onSubmit={loginSubmitHandler}>
        <BasicInputContainer labelName="아이디">
          <BasicInputField
            inputType="text"
            inputPlaceholder="아이디를 입력해주세요."
            inputValue={userId}
            inputChange={changeUserId}
          />
        </BasicInputContainer>
        <BasicInputContainer labelName="비밀번호">
          <BasicInputField
            inputType="password"
            inputPlaceholder="비밀번호를 입력해주세요."
            inputValue={password}
            inputChange={changePassword}
          />
        </BasicInputContainer>
        <BasicButton buttonType="submit" name="로그인" width="grow" height="48" />
      </form>
      <div className={styles.sub_btn}>
        <Link href="/signup">회원가입</Link>
        <span>|</span>
        <Link href="/login/find-login-data">ID/PW 찾기</Link>
      </div>
    </section>
  );
}

export default Login;
