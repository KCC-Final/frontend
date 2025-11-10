# 그루 (Groo) - Frontend

> 일상을 심다, 독서 경험의 모든 것

[![Next.js](https://img.shields.io/badge/Next.js-15.5.2-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Vercel](https://img.shields.io/badge/Vercel-Deploy-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

책을 통해 사람을 연결하는 소셜 북 커뮤니티 플랫폼의 프론트엔드 애플리케이션입니다.

## 프로젝트 소개

그루(Groo)는 독서를 통한 소통과 습관 형성을 지원하는 종합 독서 플랫폼입니다.
사용자가 책을 찾고, 읽고, 후기를 공유하며 건전한 독서 습관을 형성할 수 있도록 돕습니다.

### 핵심 가치

- **독서 동기 부여**: 독서 챌린지와 배지 시스템으로 지속적인 독서 동기 제공
- **경험 공유**: 독후감을 통한 독서 경험 나눔과 공감대 형성
- **정보 접근성**: 도서관 연동으로 책에 대한 접근성 향상
- **소셜 커뮤니티**: 팔로우, 댓글, 좋아요 등 활발한 독서 커뮤니티

## 주요 기능

### 도서 탐색 및 검색

- 추천 도서, 베스트셀러, 필독도서 조회
- 키워드/저자/ISBN 기반 도서 검색
- 도서 상세 정보 및 리뷰 확인

### 독서 기록 및 관리

- 개인 책장 관리 (읽은 책, 읽고 싶은 책, 읽는 중)
- 독후감 작성 및 공유 (마크다운 지원)
- 독서 통계 및 히스토리

### 소셜 기능

- 다른 사용자 팔로우/팔로워
- 독후감 댓글 및 좋아요
- 실시간 알림
- 피드 조회 (최신순/공감순/팔로우)

### 독서 챌린지

- 개인별 독서 목표 설정
- 진행 상황 추적
- 배지 및 성취 시스템

## 기술 스택

- **Framework**: Next.js 15.5.2 (App Router)
- **Language**: TypeScript 5.0+
- **UI Library**: React 18+
- **Styling**: CSS Modules / Vanilla CSS
- **Icons**: Lucide React
- **State Management**: React Hooks + Context API + Zustand
- **HTTP Client**: Fetch API
- **Deployment**: Vercel

## 프로젝트 구조

```
frontend/
├── public/              # 정적 파일 (이미지, 폰트 등)
├── src/
│   ├── app/            # Next.js App Router 페이지
│   │   ├── (auth)/     # 인증 관련 페이지
│   │   ├── books/      # 도서 관련 페이지
│   │   ├── reviews/    # 독후감 관련 페이지
│   │   ├── challenges/ # 챌린지 관련 페이지
│   │   └── ...
│   ├── components/     # 재사용 가능한 컴포넌트
│   │   ├── common/     # 공통 컴포넌트
│   │   ├── book/       # 도서 관련 컴포넌트
│   │   ├── review/     # 독후감 관련 컴포넌트
│   │   └── ...
│   ├── lib/            # 유틸리티 및 헬퍼 함수
│   ├── styles/         # 전역 스타일 및 CSS 모듈
│   └── types/          # TypeScript 타입 정의
├── .env.local          # 로컬 환경 변수 (git ignored)
├── .env.example        # 환경 변수 예시
├── next.config.js      # Next.js 설정
└── package.json        # 의존성 관리
```

## 시작하기

### 사전 요구사항

- Node.js 18.0.0 이상
- npm 또는 yarn

### 설치 및 실행

```bash
# 저장소 클론
git clone https://github.com/KCC-Final/frontend.git
cd frontend

# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env.local
# .env.local 파일을 열어 필요한 환경 변수 설정

# 개발 서버 실행
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)으로 접속

### 환경 변수

`.env.example` 파일을 참고하여 `.env.local` 파일을 생성하고 필요한 환경 변수를 설정하세요.

### 빌드 및 배포

```bash
# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

## 개발 가이드

### 코드 스타일

- TypeScript를 사용하여 타입 안정성 확보
- ESLint 및 Prettier 설정 준수
- 컴포넌트는 함수형 컴포넌트로 작성
- CSS Modules를 사용한 스타일링

### 컴포넌트 작성 가이드

```typescript
// src/components/example/ExampleComponent.tsx
interface ExampleComponentProps {
  title: string;
  onAction?: () => void;
}

export default function ExampleComponent({
  title,
  onAction
}: ExampleComponentProps) {
  return (
    <div className={styles.container}>
      <h2>{title}</h2>
      {onAction && <button onClick={onAction}>Action</button>}
    </div>
  );
}
```

### API 호출 예시

```typescript
// src/lib/api/books.ts
export async function fetchBooks() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/books`, {
    credentials: 'include' // 쿠키 포함
  });

  if (!response.ok) {
    throw new Error('Failed to fetch books');
  }

  return response.json();
}
```

## 스크립트

```bash
npm run dev          # 개발 서버 실행
npm run build        # 프로덕션 빌드
npm start            # 프로덕션 서버 실행
npm run lint         # ESLint 실행
npm run lint:fix     # ESLint 자동 수정
```

## 브라우저 지원

- Chrome (최신 버전)
- Firefox (최신 버전)
- Safari (최신 버전)
- Edge (최신 버전)

## 팀

**팀명**: 트리버스 (Traverse)

**팀원**:

- 최윤성
- 엄윤호
- 김연수

## 관련 링크

- [Backend Repository](https://github.com/KCC-Final/backend)
- [API Documentation](https://api.groo.site/swagger-ui.html)

## 라이선스

이 프로젝트는 교육 목적으로 제작되었습니다.
