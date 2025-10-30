import { fetchLibrary } from '@/apis/library';

async function TestPopularLoanBooksPage() {
  // 날짜 계산
  const today = new Date();
  const endDate = today.toISOString().split('T')[0];
  const startDate = new Date(today.setMonth(today.getMonth() - 1)).toISOString().split('T')[0];

  let result = {
    success: false,
    message: '',
    data: null as any,
    error: null as any
  };

  try {
    const response = await fetchLibrary.getLoanItemsByLibOrRegion(
      undefined,
      undefined,
      undefined,
      startDate,
      endDate,
      undefined,
      undefined,
      1,
      10
    );

    result.success = true;
    result.message = 'API 호출 성공';
    result.data = response;
  } catch (error) {
    result.success = false;
    result.message = 'API 호출 실패';
    result.error = error instanceof Error ? error.message : String(error);
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '1rem' }}>인기 대출도서 API 테스트</h1>

      <div
        style={{
          padding: '1rem',
          background: result.success ? '#d4edda' : '#f8d7da',
          border: `1px solid ${result.success ? '#c3e6cb' : '#f5c6cb'}`,
          borderRadius: '4px',
          marginBottom: '1rem'
        }}>
        <h2 style={{ margin: 0 }}>{result.success ? '✓ 성공' : '✗ 실패'}</h2>
        <p style={{ margin: '0.5rem 0 0 0' }}>{result.message}</p>
      </div>

      {result.error && (
        <div
          style={{
            padding: '1rem',
            background: '#fff3cd',
            border: '1px solid #ffc107',
            borderRadius: '4px',
            marginBottom: '1rem'
          }}>
          <h3 style={{ margin: '0 0 0.5rem 0' }}>에러 내용:</h3>
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{result.error}</pre>
        </div>
      )}

      {result.data && (
        <div style={{ marginTop: '1rem' }}>
          <h3>API 응답 데이터:</h3>
          <pre
            style={{
              background: '#f5f5f5',
              padding: '1rem',
              borderRadius: '4px',
              overflow: 'auto',
              maxHeight: '600px'
            }}>
            {JSON.stringify(result.data, null, 2)}
          </pre>

          {result.data?.response?.docs?.doc && (
            <div style={{ marginTop: '1rem' }}>
              <h3>
                총 {Array.isArray(result.data.response.docs.doc) ? result.data.response.docs.doc.length : 1}
                개의 도서 발견
              </h3>
            </div>
          )}
        </div>
      )}

      <div style={{ marginTop: '2rem', padding: '1rem', background: '#e7f3ff', borderRadius: '4px' }}>
        <h3>확인 사항:</h3>
        <ul>
          <li>정보나루 API 키가 환경변수에 설정되어 있는지 확인</li>
          <li>
            날짜 범위: {startDate} ~ {endDate}
          </li>
          <li>API 엔드포인트: /loanItemSrchByLib</li>
          <li>네트워크 탭에서 실제 API 호출을 확인</li>
        </ul>
      </div>
    </div>
  );
}

export default TestPopularLoanBooksPage;
