import axios, { AxiosInstance, isAxiosError } from 'axios';

import { devLogger } from '@/utils/dev-logger';
import { ApiError } from '@/utils/error/api';

const grooApiBaseURL = `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_GROO_COMMON_PATH}`;

/** 서버에서 Groo API 요청을 위한 axios 인스턴스 생성 */
function createAxiosInServer(): AxiosInstance {
  const axiosGrooInServer = axios.create({
    baseURL: grooApiBaseURL,
    timeout: 10 * 1000
  });

  // axios 요청 공통 설정
  axiosGrooInServer.interceptors.request.use(
    // axios 요청시 공통 작업
    (config) => {
      // 요청 발생시 로그 출력
      devLogger(`[Groo Server API]|[Request Info]: ${config.method?.toUpperCase()} | ${config.url}`);

      return config;
    },
    // axios 요청오류시 공통 작업
    (error) => {
      return Promise.reject(error);
    }
  );

  // axios 응답 공통 설정
  axiosGrooInServer.interceptors.response.use(
    // axios 응답시 공통작업
    (response) => {
      // 응답 발생시 로그 출력
      devLogger(
        `[Groo Server API]|[Response Info]: ${response.status} | ${response.config.method?.toUpperCase()} | ${response.config.url}`
      );

      return response;
    },
    // axios 응답오류시 공통작업
    async (error) => {
      // axios 에러인지 확인
      if (isAxiosError(error)) {
        // 응답을 받은 경우 (응답 상태코드가 2xx가 아닌 경우)
        if (error.response) {
          const status = error.response.status;
          const { method, url } = error.response.config;
          const message = error.response.data?.message;
          const data = error.response.data?.data;

          devLogger(
            `[Groo Server API]|[Response Error]: ${status} | ${method?.toUpperCase()} | ${url} | ${message}`,
            true
          );
          throw new ApiError({
            message: message,
            status: status,
            apiMessage: message,
            apiData: data,
            original: error
          });
        }

        // 요청은 성공했으나, 응답이 없는 경우
        if (error.request) {
          devLogger('[Groo Server API]|[Response Error]: Failed to get a response', true);
          throw new ApiError({
            message: '서버에서 응답을 받지 못했습니다. 네트워크를 확인해주세요',
            original: error
          });
        }
      }

      devLogger('[Groo Server API]|[Response Error]: Occurred unknown Error', true);
      throw new ApiError({ message: '알 수 없는 오류가 발생했습니다.', original: error });
    }
  );

  return axiosGrooInServer;
}

export default createAxiosInServer;
