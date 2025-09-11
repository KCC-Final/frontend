import type { NextConfig } from 'next';

const isDev = process.env.NODE_ENV === 'development';
const isProd = process.env.NODE_ENV === 'production';

// 실행 환경을 터미널/빌드 로그에 출력하여 확인을 용이하게 합니다.
console.log('개발 환경:', isDev);
console.log('운영 환경:', isProd);

const nextConfig: NextConfig = {
  // -----------------------------------------------------------------
  // [배포 환경 전용]
  // 'npm run build' 실행 시, S3와 같은 정적 호스팅에 올릴 수 있도록
  // 순수한 HTML/CSS/JS 파일을 'out' 폴더에 생성합니다.
  // -----------------------------------------------------------------
  ...(isProd && { output: 'export' }),

  // -----------------------------------------------------------------
  // [개발 환경 전용]
  // Docker 환경에서 파일 수정이 실시간으로 반영(Hot Reload)되도록
  // Webpack의 파일 감지 방식을 폴링(polling)으로 설정합니다.
  // -----------------------------------------------------------------
  ...(isDev && {
    webpack: (config) => {
      config.watchOptions = {
        poll: 1000, // 1초마다 파일 변경이 있는지 확인
        aggregateTimeout: 300 // 변경 감지 후 0.3초 대기 후 빌드
      };
      return config;
    }
  })
};

export default nextConfig;
