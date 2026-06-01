# erp_practice

## SpringBoot 기반 ERP 시스템 구현 연습

예외처리 생성
jwt 설정
domain 생성

api 테스트 도구 : Chrom Talend API

front-end

- vite React
- npm create vite@latest (폴더명) -- --template react-ts
- 사용 라이브러리
  - npm install axios (HTTP 통신)
  - npm install react-router-dom (라우팅)
  - npm install -D @types/react-router-dom (타입정의)
  - npm install zustand (상태관리 - 토큰저장용)
  - npm install @mui/material @emotion/react @emotion/styled (UI 컴포넌트 - 빠른 UI구성)

- user
  api테스트 경로
  - 회원가입 : http://localhost:8080/api/auth/signup
  - 로그인 : http://localhost:8080/api/auth/login
  - 내정보조회(accessToken) : http://localhost:8080/api/auth/me
