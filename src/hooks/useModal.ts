import { Dispatch, SetStateAction, useState } from 'react';

type UseModalReturnType = [boolean, Dispatch<SetStateAction<boolean>>, () => void, () => void];

/**
 * 모달 열림 상태 관리 함수
 * @param initialState 초기 상태
 * @returns [열림 상태, 상태 변경 함수, 열기 함수, 닫기 함수]
 */
export const useModalState = (initialState: boolean = false): UseModalReturnType => {
  const [isOpen, setOpen] = useState(initialState);

  const openHandler = () => {
    setOpen(true);
  };

  const closeHandler = () => {
    setOpen(false);
  };

  return [isOpen, setOpen, openHandler, closeHandler];
};
