import type { NextConfig } from 'next';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require('path');

const isDev = process.env.NODE_ENV === 'development';
const isProd = process.env.NODE_ENV === 'production';

// 실행 환경 출력 (로그 확인용)
if (isDev) console.log('개발 환경에서 실행');
if (isProd) console.log('운영 환경에서 실행');

const nextConfig: NextConfig = {
  // -----------------------------------------------------------------
  // [외부 이미지 도메인 허용 목록]
  // -----------------------------------------------------------------
  images: {
    remotePatterns: [
      // 알라딘 (https)
      {
        protocol: 'https',
        hostname: 'image.aladin.co.kr',
        port: '',
        pathname: '/product/**'
      },
      // 알라딘 (http)
      {
        protocol: 'http',
        hostname: 'image.aladin.co.kr',
        port: '',
        pathname: '/product/**'
      },
      // 네이버 책 썸네일 (https)
      {
        protocol: 'https',
        hostname: 'bookthumb-phinf.pstatic.net',
        port: '',
        pathname: '/**'
      },
      // 네이버 책 썸네일 (http)
      {
        protocol: 'http',
        hostname: 'bookthumb-phinf.pstatic.net',
        port: '',
        pathname: '/**'
      },
      // 네이버 쇼핑 이미지
      {
        protocol: 'https',
        hostname: 'shopping-phinf.pstatic.net'
      },
      // 알라딘 추가 도메인
      {
        protocol: 'https',
        hostname: 'img.aladin.co.kr'
      },
      // YES24 이미지
      {
        protocol: 'https',
        hostname: 'image.yes24.com'
      },
      // 국립중앙도서관 이미지 (현재 에러 원인)
      {
        protocol: 'http',
        hostname: 'www.nl.go.kr',
        port: '',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'www.nl.go.kr',
        port: '',
        pathname: '/**'
      }
    ]
  },

  // -----------------------------------------------------------------
  // [SCSS 설정] - SCSS 모듈에서 @/ 경로 인식 가능하게 설정
  // -----------------------------------------------------------------
  sassOptions: {
    includePaths: [path.join(__dirname, 'src')]
  },

  // -----------------------------------------------------------------
  // [개발 환경 전용 Webpack 설정]
  // Docker 환경에서 Hot Reload가 즉시 반영되도록 폴링 활성화
  // -----------------------------------------------------------------
  ...(isDev && {
    webpack: (config) => {
      config.watchOptions = {
        poll: 1000, // 1초마다 파일 변경 감지
        aggregateTimeout: 300 // 변경 감지 후 0.3초 대기
      };
      return config;
    }
  })
};

export default nextConfig;
