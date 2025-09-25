export const ALADIN_PROXY_CONFIG = {
  BASE_URL: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/aladin`,
  TTB_KEY: process.env.NEXT_PUBLIC_ALADIN_TTBKEY || ''
} as const;
