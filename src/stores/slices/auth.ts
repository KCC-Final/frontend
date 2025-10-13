import { StateCreator } from 'zustand';

import { AuthSlice, AuthState } from '@/types';

const initialAuthState: AuthState = {
  myInfo: null
};

export const createAuthSlice: StateCreator<AuthSlice, [['zustand/devtools', never]]> = (set) => ({
  ...initialAuthState,
  setMyInfo: (user) => set({ myInfo: user }, false, 'auth/setMyInfo')
});
