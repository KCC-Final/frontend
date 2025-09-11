# Contributing Guide

## 🌿 브랜치 전략

### 브랜치 명명 규칙

```
타입/이슈번호/기능이름
```

**브랜치 타입:**

- `feature/` - 새로운 기능 개발
- `fix/` - 버그 수정
- `docs/` - 문서 관련
- `style/` - 코드 포맷팅, 세미콜론 누락 등
- `refactor/` - 코드 리팩토링
- `test/` - 테스트 코드
- `chore/` - 빌드, 패키지 매니저 설정 등
- `design/` - CSS 디자인 관련

**브랜치명 예시:**

- `feature/123/user-login` - 이슈 #123의 사용자 로그인 기능
- `fix/456/password-validation` - 이슈 #456의 패스워드 검증 버그 수정
- `docs/789/api-documentation` - 이슈 #789의 API 문서 작성
- `design/101/responsive-header` - 이슈 #101의 반응형 헤더 디자인

**이슈 번호가 없는 경우:**

- `hotfix/critical-security-patch` - 긴급 보안 패치
- `chore/dependency-update` - 의존성 업데이트

### 브랜치 생성 및 작업 플로우

1. **이슈 생성** → GitHub Issues에서 작업할 내용 정리 (Bug Report/Feature Request 템플릿 사용)
2. **작업 진행** → 기능 개발/버그 수정
3. **PR 생성** → 템플릿에 따라 상세 정보 작성 (반드시 `Closes #이슈번호` 포함)
4. **코드 리뷰** → 팀원 1명 이상 승인 필요5. **머지** → Squash and merge 권장 (이슈 자동 종료)

## 📝 커밋 메시지 컨벤션

### Git 7가지 규칙

1. **제목과 본문을 빈 행으로 구분**
2. **제목을 50글자 이내로 제한**
3. **제목의 첫 글자는 대문자로 작성**
4. **제목의 끝에는 마침표를 넣지 않음**
5. **본문의 각 행은 72글자 내로 제한**

### 커밋 메시지 구조

```
<type>(<scope>): <subject>    -- 헤더
<BLANK LINE>                  -- 빈 줄
<body>                        -- 본문
<BLANK LINE>                  -- 빈 줄
<footer>                      -- 바닥 글
```

### 타입 (Type)

- `feat`: 새로운 기능에 대한 커밋
- `fix`: 버그 수정에 대한 커밋
- `build`: 빌드 관련 파일 수정에 대한 커밋
- `chore`: 그 외 자잘한 수정에 대한 커밋
- `ci`: CI 관련 설정 수정에 대한 커밋
- `docs`: 문서 수정에 대한 커밋
- `style`: 코드 스타일 혹은 포맷 등에 관한 커밋
- `design`: CSS 수정
- `refactor`: 코드 리팩토링에 대한 커밋
- `test`: 테스트 코드 수정에 대한 커밋

### 커밋 메시지 예시

```
feat: 회원 관리 기능 추가

회원 가입, 로그인, 로그아웃 기능을 구현
- OAuth 2.0을 사용한 소셜 로그인 지원
- JWT 토큰 기반 인증 시스템 적용
- 사용자 프로필 관리 페이지 추가

Closes #123
```

### 이슈 자동 종료 키워드

PR이 머지될 때 이슈를 자동으로 닫으려면 커밋 메시지나 PR 설명에 다음 키워드 사용:

**이슈 종료:**

- `close`, `closes`, `closed`
- `fix`, `fixes`, `fixed`
- `resolve`, `resolves`, `resolved`

**예시:**

```
fix: 로그인 버그 수정

사용자 인증 시 발생하는 토큰 만료 오류 해결

Fixes #456
```

## 🚀 배포 및 환경 관리

### 환경별 브랜치

- `main` - 프로덕션 환경
- `develop` - 개발 환경

### 배포 전 체크리스트

- [ ] 모든 테스트 통과
- [ ] 프로덕션 빌드 성공 확인
- [ ] 환경 변수 설정 확인
- [ ] 데이터베이스 마이그레이션 준비 (백엔드)
- [ ] 롤백 계획 수립

## 📋 이슈 관리

### 이슈 라벨링

- `bug` - 버그 리포트
- `feature` - 새로운 기능 요청
- `documentation` - 문서 관련
- `question` - 질문
- `good first issue` - 새로운 기여자를 위한 이슈
- `help wanted` - 도움이 필요한 이슈
- `priority: high/medium/low` - 우선순위

### 이슈 템플릿 활용

- **Bug Report**: 버그 발생 시 체계적인 리포트 작성
- **Feature Request**: 새로운 기능 요청 시 상세한 명세 작성
- **Question**: 프로젝트 관련 질문 시 구체적인 상황 설명

## 🎯 팀 컨벤션

### 개발 환경

- **코드 에디터**: VSCode
- **포맷터**: Prettier 사용
- **린터**: ESLint (Frontend), 관련 린터 (Backend)
