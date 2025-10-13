import { StateCreator } from 'zustand';

import { FindId, FindLoginDataSlice, FindLoginDataState, FindLoginDataStep } from '@/types';

const initialFindIdState: FindLoginDataState = {
  findLoginDataStep: 1,
  findId: {
    isSuccess: false,
    userId: ''
  }
};

export const createFindIdSlice: StateCreator<FindLoginDataSlice, [['zustand/devtools', never]]> = (set) => ({
  ...initialFindIdState,

  setFindLoginDataStep: (step: FindLoginDataStep) =>
    set({ findLoginDataStep: step }, false, 'findLoginData/setFindLoginDataStep'),

  setFindIdState: (findId: FindId) => set({ findId: findId }, false, 'findLoginData/setFindIdState'),

  resetFindLoginDataState: () => set(initialFindIdState, false, 'findLoginData/resetFindLoginDataState')
});
