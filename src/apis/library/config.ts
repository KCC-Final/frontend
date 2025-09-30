import axios, { isAxiosError } from 'axios';

import { devLogger } from '@/utils/dev-logger';
import { ApiError } from '@/utils/error/api';

const libraryApiBaseURL = process.env.NEXT_PUBLIC_API_URL;
const commonPath = '/api/data4library';
const AUTH_KEY = process.env.NEXT_PUBLIC_DATA4LIBRARY_KEY;

const axiosLibrary = axios.create({
  baseURL: `${libraryApiBaseURL}${commonPath}`,
  timeout: 10 * 1000
});

// axios 요청 공통 설정
axiosLibrary.interceptors.request.use(
  // axios 요청시 공통 작업
  (config) => {
    if (AUTH_KEY) {
      config.params = {
        ...config.params,
        authKey: AUTH_KEY,
        format: 'json'
      };
    } else {
      devLogger('[Library API]|[Config Error]: auth-key값이 없습니다.', true);
    }

    // 요청 발생시 로그 출력
    const { method, url } = config;
    devLogger(`[Library API]|[Request Info]: ${method?.toUpperCase()} | ${url}`);

    return config;
  },
  // axios 요청오류시 공통 작업
  (error) => {
    return Promise.reject(error);
  }
);

// axios 응답 공통 설정
axiosLibrary.interceptors.response.use(
  // axios 응답시 공통작업
  (response) => {
    // 응답 발생시 로그 출력
    const { status } = response;
    const { method, url } = response.config;
    devLogger(`[Library API]|[Response Info]: ${status} | ${method?.toUpperCase()} | ${url}`);

    return response;
  },
  // axios 응답오류시 공통작업
  (error) => {
    // axios 에러인지 확인
    if (isAxiosError(error)) {
      // 응답을 받은 경우 (응답 상태코드가 2xx가 아닌 경우)
      if (error.response) {
        const status = error.response.status;
        const { method, url } = error.response.config;
        const data = error.response.data;

        devLogger(`[Library API]|[Response Error]: ${status} | ${method?.toUpperCase()} | ${url}`, true);
        throw new ApiError({
          message: '정보나루 데이터 요청에 실패했습니다.',
          status: status,
          apiMessage: '',
          apiData: data,
          original: error
        });
      }

      // 요청은 성공했으나, 응답이 없는 경우
      if (error.request) {
        devLogger('[Library API]|[Response Error]: Failed to get a response', true);
        throw new ApiError({
          message: '서버에서 응답을 받지 못했습니다. 네트워크를 확인해주세요',
          original: error
        });
      }
    }

    devLogger('[Library API]|[Response Error]: Occuered unknown Error', true);
    throw new ApiError({ message: '알 수 없는 오류가 발생했습니다.', original: error });
  }
);

export default axiosLibrary;
