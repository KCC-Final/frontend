// src/app/test/backend/page.tsx
'use client';

import { useEffect, useState } from 'react';

import { BACKEND_API_BASE } from '@/api/backend/config';

export default function BackendTestPage() {
  const [message, setMessage] = useState('Loading...');

  useEffect(() => {
    fetch(`${BACKEND_API_BASE}/api/test/ping`)
      .then((res) => {
        if (!res.ok) throw new Error('API 호출 실패');
        return res.text();
      })
      .then((data) => setMessage(data))
      .catch((err) => setMessage('❌ Error: ' + err.message));
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>백엔드 통신 테스트</h1>
      <p>응답: {message}</p>
    </div>
  );
}
