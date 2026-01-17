# 🐠 원양어선 - 어항 속 물고기 웹서비스

접속자들을 어항 속의 물고기로 표현하는 인터랙티브 웹서비스입니다.

## ✨ 주요 기능

- **실시간 어항**: 접속자들이 물고기가 되어 어항에서 헤엄치는 모습을 실시간으로 확인
- **다양한 물고기**: 6가지 물고기 타입 선택 가능 (금붕어, 열대어, 상어, 고래, 문어, 게)
- **자동 애니메이션**: 물고기들이 자동으로 움직이며 생동감 있는 어항 구현
- **사용자 관리**: 로그인/회원가입을 통한 개인화된 물고기 관리
- **마이페이지**: 내 물고기 정보 및 어항 통계 확인

## 🏗️ 프로젝트 구조

```
src/
├── components/           # 재사용 가능한 UI 컴포넌트
│   ├── common/          # 공통 컴포넌트 (Header, Button 등)
│   ├── fish/            # 물고기 관련 컴포넌트
│   └── ui/              # UI 전용 컴포넌트 (OceanBackground 등)
├── pages/               # 페이지 컴포넌트
│   ├── Home.jsx         # 어항 메인 화면
│   ├── Login.jsx        # 로그인 페이지
│   ├── Register.jsx     # 회원가입 페이지
│   └── MyPage.jsx       # 마이페이지
├── layouts/             # 레이아웃 컴포넌트
│   ├── MainLayout.jsx   # 헤더 + 바디 레이아웃
│   └── AuthLayout.jsx   # 로그인/회원가입용 레이아웃
├── contexts/            # React Context (상태 관리)
│   ├── AuthContext.js   # 로그인 상태 관리
│   └── FishContext.js   # 물고기/어항 상태 관리
├── hooks/               # 커스텀 훅
│   ├── useAuth.js       # 인증 관련 훅
│   └── useFish.js       # 물고기 관련 훅
├── services/            # API 호출 관련
│   ├── api.js           # 기본 API 설정
│   ├── authService.js   # 인증 API
│   └── fishService.js   # 물고기 API
├── utils/               # 유틸리티 함수
│   ├── constants.js     # 상수 정의
│   └── helpers.js       # 헬퍼 함수
└── styles/              # 스타일 파일
    ├── global.css       # 전역 스타일
    ├── index.css        # 기본 스타일
    └── App.css          # 앱 스타일
```

## 🚀 시작하기

### 설치

```bash
cd frontend/dfs-react-frontend
npm install
```

### 개발 서버 실행

```bash
npm start
```

브라우저에서 [http://localhost:3000](http://localhost:3000)으로 접속하세요.

### 빌드

```bash
npm run build
```

## 🐟 물고기 타입

| 타입 | 이모지 | 특징 |
|------|--------|------|
| 금붕어 | 🐠 | 기본 물고기, 중간 속도 |
| 열대어 | 🐟 | 빠른 속도, 작은 크기 |
| 상어 | 🦈 | 느린 속도, 큰 크기 |
| 고래 | 🐋 | 매우 느린 속도, 매우 큰 크기 |
| 문어 | 🐙 | 매우 빠른 속도, 중간 크기 |
| 게 | 🦀 | 느린 속도, 작은 크기 |

## 🎨 주요 화면

### 1. 어항 (홈페이지)
- 실시간으로 접속자들의 물고기가 헤엄치는 모습
- 물거품 효과와 해초 등 자연스러운 어항 환경
- 로그인 시 자동으로 내 물고기 생성

### 2. 로그인/회원가입
- 간단한 폼을 통한 사용자 인증
- 회원가입 시 물고기 타입 선택 가능
- 데모 모드 지원 (임시 계정)

### 3. 마이페이지
- 내 물고기 정보 및 설정
- 물고기 타입 변경 기능
- 어항 통계 및 활동 시간 확인

## 🛠️ 기술 스택

- **Frontend**: React 19, React Router DOM
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Build Tool**: Create React App
- **Package Manager**: npm

## 📱 반응형 디자인

모든 화면이 데스크톱, 태블릿, 모바일에서 최적화되어 표시됩니다.

## 🔧 개발 가이드

### 새로운 물고기 타입 추가

1. `src/utils/constants.js`에서 `FISH_TYPES`와 `FISH_INFO` 업데이트
2. 회원가입 및 마이페이지의 물고기 선택 옵션에 추가

### 새로운 페이지 추가

1. `src/pages/` 폴더에 새 컴포넌트 생성
2. `src/App.jsx`에서 라우트 추가
3. 필요에 따라 헤더 네비게이션 업데이트

### API 연동

현재는 로컬 스토리지를 사용한 데모 모드로 구현되어 있습니다.
실제 백엔드 연동을 위해서는 `src/services/` 폴더의 API 서비스들을 실제 엔드포인트로 연결하세요.

## 🎯 향후 개선 계획

- [ ] 실시간 WebSocket 연결로 물고기 동기화
- [ ] 물고기 간 상호작용 기능
- [ ] 어항 테마 변경 기능
- [ ] 채팅 기능 추가
- [ ] 물고기 레벨 시스템
- [ ] 어항 꾸미기 기능

## 📄 라이선스

MIT License