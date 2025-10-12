import { useRouter } from 'next/navigation';
import { useShallow } from 'zustand/shallow';

import BasicButton from '@/components/layout/button/basic';
import styles from '@/components/user/find-login-data/find-login-data.module.scss';
import useBoundStore from '@/stores';

function FindIdSuccess() {
  const router = useRouter();

  // 로그인 정보 찾기 저장소의 state 및 actions 불러오기
  const { findId, setStep, resetState } = useBoundStore(
    useShallow((state) => ({
      findId: state.findId,
      setStep: state.setFindLoginDataStep,
      resetState: state.resetFindLoginDataState
    }))
  );

  /**
   * 비밀번호 재설정 버튼
   */
  const routeFindPwPage = () => {
    setStep(3);
  };

  /**
   * 로그인하러 가기 버튼
   */
  const routeLoginPage = () => {
    resetState();
    router.push('/login');
  };

  return (
    <section className={styles.success}>
      <h1>가입 정보를 확인해주세요</h1>
      <div className={styles.id}>
        <span>[프로필]</span>
        <span>ID: {findId.userId}</span>
      </div>
      <div className={styles.info}>
        <div className={styles.created}>
          <span>가입일</span>
          <span>2025-09-28</span>
        </div>
        <div className={styles.last_login}>
          <span>최종로그인</span>
          <span>2025-09-29</span>
        </div>
      </div>
      <div className={styles.buttons}>
        <BasicButton
          name="비밀번호 재설정"
          handler={routeFindPwPage}
          width="grow"
          height="36"
          bgColor="gray"
        />
        <BasicButton
          name="로그인하러 가기"
          handler={routeLoginPage}
          width="grow"
          height="36"
          bgColor="gray"
        />
      </div>
    </section>
  );
}

export default FindIdSuccess;
