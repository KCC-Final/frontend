/** 한국 시간 기준, 다음 날 자정까지 남은 시간을 밀리초(ms)로 반환합니다. */
export const getMsUntilNextMidnight = (): number => {
  const KST_OFFSET = 9 * 60 * 60 * 1000;
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60 * 1000;
  const nowKST = new Date(utc + KST_OFFSET);

  // 한국 시간 기준 다음 날 자정 (00:00:05) 계산 - 5초는 여유 시간
  const nextMidnightKST = new Date(nowKST.getFullYear(), nowKST.getMonth(), nowKST.getDate() + 1, 0, 0, 5);

  return nextMidnightKST.getTime() - nowKST.getTime();
};

/**
 * 콜백 함수를 다음 날 자정에 실행하고, 그 후 24시간마다 반복합니다.
 * @param callback 실행할 콜백 함수
 * @returns 타이머를 정리하는 cleanup 함수
 */
export const setMidnightTimer = (callback: () => void): (() => void) => {
  const delay = getMsUntilNextMidnight();
  let intervalId: NodeJS.Timeout;

  const timeoutId = setTimeout(() => {
    callback();
    intervalId = setInterval(callback, 24 * 60 * 60 * 1000);
  }, delay);

  return () => {
    clearTimeout(timeoutId);
    if (intervalId) {
      clearInterval(intervalId);
    }
  };
};
