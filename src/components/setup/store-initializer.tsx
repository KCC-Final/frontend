'use client';

import { useRef } from 'react';

import useBoundStore from '@/stores';
import { User } from '@/types';

interface StoreInitializerProps {
  user: User | null;
}

function StoreInitializer({ user }: StoreInitializerProps) {
  const initialized = useRef(false);

  if (!initialized.current) {
    useBoundStore.getState().setMyInfo(user);
    initialized.current = true;
  }

  return null;
}

export default StoreInitializer;
