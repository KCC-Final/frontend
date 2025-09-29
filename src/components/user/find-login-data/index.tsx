'use client';

import { useShallow } from 'zustand/shallow';

import FindUserId from '@/components/user/find-login-data/find-id';
import FindPassword from '@/components/user/find-login-data/find-pw';
import FindIdSuccess from '@/components/user/find-login-data/success';
import useBoundStore from '@/stores';

function FindLoginData() {
  // 회원가입 저장소의 state 및 actions 불러오기
  const { step } = useBoundStore(useShallow((state) => ({ step: state.findLoginDataStep })));

  return (
    <>
      {step === 1 && <FindUserId />}
      {step === 2 && <FindIdSuccess />}
      {step === 3 && <FindPassword />}
    </>
  );
}

export default FindLoginData;
