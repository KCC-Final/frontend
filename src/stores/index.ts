import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { createFindIdSlice } from '@/stores/slices/find-id';
import { createSignupSlice } from '@/stores/slices/signup';
import { SignupSlice } from '@/types';
import { FindIdSlice } from '@/types/user/find-id';

export type BoundState = SignupSlice & FindIdSlice;

const useBoundStore = create<BoundState>()(
  devtools((...a) => ({
    ...createSignupSlice(...a),
    ...createFindIdSlice(...a)
  }))
);

export default useBoundStore;
