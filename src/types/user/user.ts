import { User } from '@/types';

export interface AuthState {
  myInfo: User | null;
}

export interface AuthActions {
  setMyInfo: (user: User | null) => void;
}

export type AuthSlice = AuthState & AuthActions;
