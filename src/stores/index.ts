import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { createSignupSlice } from '@/stores/slices/signup';
import { SignupSlice } from '@/types';

export type BoundState = SignupSlice;

const useBoundStore = create<BoundState>()(
  devtools((...a) => ({
    ...createSignupSlice(...a)
  }))
);

export default useBoundStore;
