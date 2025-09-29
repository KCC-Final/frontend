'use client';

import Link from 'next/link';

import styles from '@/components/user/login.module.scss';
import { useInputText } from '@/hooks/useInput';

function Login() {
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
    }
    if (!password) {
      alert('비밀번호를 입력해주세요.');
      return;
    }

    alert(`로그인 기능은 아직 구현되지 않았습니다.\nid: ${userId}\npw: ${password}`);
  };

  return (
    <section className={styles.login}>
      <h2>
        <p>일상을 심다</p>
        <p>독서 경험의 모든 것</p>
      </h2>
      <form onSubmit={loginSubmitHandler}>
        <div className={styles.id}>
          <div>아이디</div>
          <input
            type="text"
            name="userId"
            value={userId}
            onChange={changeUserId}
            placeholder="아이디를 입력해주세요."
          />
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
        </div>
        <div className={styles.submit}>
          <button type="submit">로그인</button>
        </div>
      </form>
      <div className={styles.sub_btn}>
        <Link href="/signup">회원가입</Link>
        <span>|</span>
        <Link href="/login/find-id">ID/PW 찾기</Link>
      </div>
    </section>
  );
}

export default Login;
