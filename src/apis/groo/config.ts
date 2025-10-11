import axios, { isAxiosError } from 'axios';

import { devLogger } from '@/utils/dev-logger';
import { ApiError } from '@/utils/error/api';

const grooApiBaseURL = `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_GROO_COMMON_PATH}`;

const axiosGroo = axios.create({
  baseURL: grooApiBaseURL,
  withCredentials: true,
  timeout: 10 * 1000
});

// axios 요청 공통 설정
axiosGroo.interceptors.request.use(
  (config) => {
    const { method, url } = config;
    devLogger(`[Groo API]|[Request Info]: ${method?.toUpperCase()} | ${url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// axios 응답 공통 설정
axiosGroo.interceptors.response.use(
  (response) => {
    const { status } = response;
    const { method, url } = response.config;
    devLogger(`[Groo API]|[Response Info]: ${status} | ${method?.toUpperCase()} | ${url}`);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (isAxiosError(error)) {
      if (error.response) {
        const status = error.response.status;
        const { method, url } = error.response.config;
        const message = error.response.data?.message;
        const data = error.response.data?.data;

        // 401 에러를 받은 경우
        if (error.response.status === 401) {
          devLogger(
            `[Groo API]|[Response Error]: 401 | ${method?.toUpperCase()} | ${url} | ${message}`,
            true
          );

          // 토큰 재발행 요청에서 실패한 경우
          if (url === '/token-refresh') {
            window.location.href = '/login';
            return Promise.reject(error);
          }

          // 토큰 재발행이 아닌 요청에서 401을 받은 경우
          try {
            // fetchGroo.auth.reissueToken() 대신 직접 호출
            await axiosGroo.post('/token-refresh');

            devLogger('[Groo API] Token Refreshed: 원래 요청을 재시도합니다.');
            return axiosGroo(originalRequest);
          } catch (refreshError) {
            devLogger(
              `[Groo API]|[Response Error]: ${status} | ${method?.toUpperCase()} | ${url} | ${message}`,
              true
            );
            devLogger('[Groo API] Refresh Failed: 로그인 페이지로 이동합니다.', true);
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        devLogger(
          `[Groo API]|[Response Error]: ${status} | ${method?.toUpperCase()} | ${url} | ${message}`,
          true
        );
        throw new ApiError({
          message: message || '요청에 실패했습니다.',
          status: status,
          apiMessage: message,
          apiData: data,
          original: error
        });
      }

      if (error.request) {
        devLogger('[Groo API]|[Response Error]: Failed to get a response', true);
        throw new ApiError({
          message: '서버에서 응답을 받지 못했습니다. 네트워크를 확인해주세요',
          original: error
        });
      }
    }

    devLogger('[Groo API]|[Response Error]: Occuered unknown Error', true);
    throw new ApiError({ message: '알 수 없는 오류가 발생했습니다.', original: error });
  }
);

export default axiosGroo;
