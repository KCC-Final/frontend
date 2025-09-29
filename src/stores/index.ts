import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { createFindIdSlice } from '@/stores/slices/find-login-data';
import { createSignupSlice } from '@/stores/slices/signup';
import { FindLoginDataSlice, SignupSlice } from '@/types';

export type BoundState = SignupSlice & FindLoginDataSlice;

const useBoundStore = create<BoundState>()(
  devtools((...a) => ({
    ...createSignupSlice(...a),
    ...createFindIdSlice(...a)
  }))
);

export default useBoundStore;
