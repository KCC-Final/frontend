'use client';

import { useRouter } from 'next/navigation';
import { useShallow } from 'zustand/shallow';

import BackButton from '@/components/layout/button/back-button';
import FindUserId from '@/components/user/find-login-data/find-id';
import FindPassword from '@/components/user/find-login-data/find-pw';
import FindIdSuccess from '@/components/user/find-login-data/success';
import useBoundStore from '@/stores';

function FindLoginData() {
  const router = useRouter();

  // 회원가입 저장소의 state 및 actions 불러오기
  const { step } = useBoundStore(useShallow((state) => ({ step: state.findLoginDataStep })));

  /**
   * 뒤로가기 버튼
   */
  const backButtonHandler = () => {
    router.push('/login');
  };

  return (
    <>
      <BackButton onClick={backButtonHandler} />
      {step === 1 && <FindUserId />}
      {step === 2 && <FindIdSuccess />}
      {step === 3 && <FindPassword />}
    </>
  );
}

export default FindLoginData;
