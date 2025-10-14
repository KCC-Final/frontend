import type { NextConfig } from 'next';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require('path');

const isDev = process.env.NODE_ENV === 'development';
const isProd = process.env.NODE_ENV === 'production';

// 실행 환경을 터미널/빌드 로그에 출력하여 확인을 용이하게 합니다.
if (isDev) console.log('개발 환경에서 실행');
if (isProd) console.log('운영 환경에서 실행');

const nextConfig: NextConfig = {
  // 알라딘 api에서 제공하는 이미지 도메인을 허용
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.aladin.co.kr',
        port: '',
        pathname: '/product/**'
      }
    ]
  },

  sassOptions: {
    // SCSS 파일에서 @/ 경로를 인식할 수 있도록 src 폴더를 경로에 추가
    includePaths: [path.join(__dirname, 'src')]
  },

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
