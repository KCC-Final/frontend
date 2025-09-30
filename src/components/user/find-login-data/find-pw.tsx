import { useRouter } from 'next/navigation';
import { useShallow } from 'zustand/shallow';

import { fetchGroo } from '@/apis';
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
        <div className={styles.pw}>
          <div>비밀번호</div>
          <input
            type="password"
            name="password1"
            value={password1}
            onChange={changePassword1}
            placeholder="비밀번호를 입력해주세요."
          />
          {password1 && !validate.password(password1).result && (
            <div className={`${styles.message} ${styles.fail}`}>{validate.password(password1).message}</div>
          )}
          <input
            type="password"
            name="password2"
            value={password2}
            onChange={changePassword2}
            placeholder="비밀번호를 다시 한번 입력해주세요."
          />
          {password2 && !validate.passwordConfirm(password1, password2).result && (
            <div className={`${styles.message} ${styles.fail}`}>
              {validate.passwordConfirm(password1, password2).message}
            </div>
          )}
        </div>
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
