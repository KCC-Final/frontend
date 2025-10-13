import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { createAuthSlice } from '@/stores/slices/auth';
import { createFindIdSlice } from '@/stores/slices/find-login-data';
import { createSignupSlice } from '@/stores/slices/signup';
import { AuthSlice, FindLoginDataSlice, SignupSlice } from '@/types';

export type BoundState = AuthSlice & SignupSlice & FindLoginDataSlice;

const useBoundStore = create<BoundState>()(
  devtools((...a) => ({
    ...createAuthSlice(...a),
    ...createSignupSlice(...a),
    ...createFindIdSlice(...a)
  }))
);

export default useBoundStore;
