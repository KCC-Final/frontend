# frontend

# 그루(Groo) - 일상을 심다, 독서 경험의 모든 것

> 책을 통해 사람을 연결하는 소셜 북 커뮤니티 플랫폼

[![Next.js](https://img.shields.io/badge/Next.js-15.5.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18+-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)

## 📖 프로젝트 소개

그루(Groo)는 독서를 통한 소통과 습관 형성을 지원하는 종합 독서 플랫폼입니다.
사용자가 책을 찾고, 읽고, 후기를 공유하며 건전한 독서 습관을 형성할 수 있도록 돕습니다.

### 🎯 핵심 가치

- **독서 동기 부여**: 독서 챌린지와 오늘의 문장으로 지속적인 독서 동기 제공
- **생태계 순환**: 커뮤니티 및 중고거래를 통한 책 생태계 선순환 지원
- **정보 접근성**: 가까운 도서관의 소장/대출 정보 확인 기능
- **경험 공유**: 독후감을 통한 독서 경험 나눔과 공감대 형성

## 🎨 주요 기능

### 📚 도서 관리

- **도서 탐색**: 추천/베스트셀러/독후감/필독도서 조회
- **검색 기능**: 키워드/저자/ISBN 기반 도서 검색
- **개인화 추천**: 콘텐츠 기반 추천과 개인화 재랭킹 시스템

### 🏛️ 도서관 연동

- **소장 정보**: 가까운 도서관의 도서 소장 현황 확인
- **실시간 대출**: 일부 기관의 실시간 대출 정보 제공

### ✍️ 독서 기록 & 커뮤니티

- **독후감 작성**: 마크다운 및 사진 지원
- **소셜 기능**: 팔로우, 피드, 댓글, 좋아요 시스템
- **정렬 옵션**: 최신순/공감순/팔로우 우선 정렬

### 🎯 독서 챌린지

- **목표 설정**: 개인별 독서 목표 설정 및 관리
- **진행 추적**: 체크인 기능과 달성률 대시보드
- **성취 시스템**: 배지 및 통계 제공

### 📊 관리자 기능

- **콘텐츠 관리**: 신고 처리 및 추천 큐레이션
- **시스템 관리**: 금칙어 관리, 공지사항, 지표 관리

## 💡 제안 배경

### 문제 인식

한국의 독서 인구는 2013년 62.4%에서 2023년 48.5%로 지속적으로 감소하고 있습니다. 동시에 성인 문해력도 10년간 20점 하락하여 OECD 평균에 미달하는 상황입니다.

### 해결 방안

- 독서에 대한 접근성 향상 (도서관 연동, 중고거래)
- 독서 경험의 통합 관리 (한 플랫폼에서 모든 독서 활동)
- 지속적인 동기 부여 (챌린지, 커뮤니티, 추천 시스템)

## 🛠️ 기술 스택

### Frontend

- **Framework**: Next.js 15.5.2 (App Router)
- **Language**: TypeScript
- **Styling**: CSS Modules / Vanilla CSS
- **Icons**: Lucide React
- **State Management**: React Hooks + Context API

### Backend (예정)

- **Framework**: Spring Boot
- **Language**: Java 21
- **ORM**: MyBatis
- **Database**: Mysql
- **Authentication**: Spring Security, JWT, OAuth2.0

### Infrastructure (예정)

- **Cache**: Redis
- **Batch**: Spring Batch/Quartz
- **Real-time**: WebSocket/SSE
- **External APIs**: 국립중앙도서관, 알라딘 도서

## 🚀 시작하기

### 전제 조건

- Node.js 18.0.0 이상
- npm 또는 yarn

### 설치 및 실행

```bash
# 저장소 클론
git clone https://github.com/KCC-Final/frontend.git
cd frontend

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)으로 접속하여 애플리케이션을 확인할 수 있습니다.

### 사용 가능한 스크립트

```bash
npm run dev      # 개발 서버 실행
npm run build    # 프로덕션 빌드
npm run start    # 프로덕션 서버 실행
npm run lint     # ESLint 검사
```

## 📁 프로젝트 구조

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # 인증 관련 라우트
│   │   ├── dashboard/         # 대시보드
│   │   ├── books/            # 도서 관련
│   │   ├── community/        # 커뮤니티
│   │   └── marketplace/      # 중고거래
│   ├── components/           # 재사용 컴포넌트
│   │   ├── ui/              # 기본 UI 컴포넌트
│   │   ├── layout/          # 레이아웃 컴포넌트
│   │   └── [domain]/        # 도메인별 컴포넌트
│   ├── hooks/               # 커스텀 훅
│   ├── lib/                 # 유틸리티 및 설정
│   ├── store/               # 상태 관리
│   ├── types/               # TypeScript 타입
│   └── styles/              # 스타일 파일
├── public/                  # 정적 파일
└── docs/                   # 프로젝트 문서
```

## 📊 기대 효과

### 개인적 측면

- **독서율 향상**: 지속 가능한 독서 습관 형성
- **동기 부여**: 맞춤형 추천과 챌린지를 통한 독서 의욕 증진
- **접근성 향상**: 도서관 정보 통한 독서 비용 절감

### 사회적 측면

- **독서 문화 조성**: 건전한 독서 문화 확산
- **지식 공유**: 독서 경험과 지식의 활발한 공유
- **생태계 선순환**: 도서 유통의 선순환 구조 형성

## 👥 팀 정보

**팀명**: 트리버스(Traverse)

**팀원**:

- 최윤성 (팀장)
- 엄윤호
- 김연수

**작성일**: 2025년 9월 1일

**"일상을 심다, 독서 경험의 모든 것"** - 그루(Groo)와 함께 더 나은 독서 습관을 만들어보세요! 📚✨
