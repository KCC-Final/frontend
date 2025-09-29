import { StateCreator } from 'zustand';

import { FindId, FindLoginDataSlice, FindLoginDataState, FindLoginDataStep } from '@/types';

const initialFindIdState: FindLoginDataState = {
  findLoginDataStep: 1,
  findId: {
    isSuccess: false,
    userId: ''
  },
  findPw: {
    isSuccess: false
  }
};

export const createFindIdSlice: StateCreator<FindLoginDataSlice> = (set) => ({
  ...initialFindIdState,

  setFindLoginDataStep: (step: FindLoginDataStep) => set({ findLoginDataStep: step }),

  setFindIdState: (findId: FindId) => set({ findId: findId }),

  setFindPwState: (isSuccess: boolean) => set({ findPw: { isSuccess: isSuccess } }),

  resetFindLoginDataState: () => set(initialFindIdState)
});
