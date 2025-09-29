import { StateCreator } from 'zustand';

import { FindIdSlice, FindIdState } from '@/types/user/find-id';

const initialFindIdState: FindIdState = {
  findIdisSuccess: false,
  findIdResult: ''
};

export const createFindIdSlice: StateCreator<FindIdSlice> = (set) => ({
  ...initialFindIdState,
  setFindIdState: (result: FindIdState) =>
    set({ findIdisSuccess: result.findIdisSuccess, findIdResult: result.findIdResult }),
  resetFindIdState: () => set({ findIdisSuccess: false, findIdResult: '' })
});
