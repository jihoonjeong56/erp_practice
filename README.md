# erp_practice - 진행중

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
  - npm install -D tailwindcss @tailwindcdd/vite(레이아웃 css 사용 -> 자유로운 커스터마이징과 낮은 학습난의도, 작은 번들 크기)
  - npm install @heroicons/react (아이콘 사용)

- user
  api테스트 경로
  - 회원가입 : http://localhost:8080/api/auth/signup

  ```
  {
    "username": "admin01",
    "password": "password123",
    "name": "홍길동",
    "email": "hong@example.com"
  }
  ```

  - 로그인 : http://localhost:8080/api/auth/login

  ```
  {
    "username": "admin01",
    "password": "password123"
  }
  ```

  - 내정보조회(GET-accessToken) : http://localhost:8080/api/auth/me
  - 권한(Role) 구분

- department(부서)
  - department 조회 -> Repository Query 및 springboot Method naming 활용하여 Service 단순화
    .selfJoin 사용
    api테스트 경로
  - 최상위부서 등록(POST) : http://localhost:8080/api/departments

  ```
  {
    "deptCode": "HQ",
    "deptName": "본사",
    "sortOrder": 1
  }
  ```

  - 하위 부서 등록-parentId 사용(POST) : http://localhost:8080/api/departments

  ```
  {
    "deptCode": "HQ",
    "deptName": "본사",
    "sortOrder": 1,
    "parentId": 1
  }
  ```

  - 트리구조 조회(GET-accessToken) : http://localhost:8080/api/departments/tree
  - 전체목록 조회(GET-accessToken) : http://localhost:8080/api/departments
  - 부서 단건 조회(GET-accessToken) : http://localhost:8080/api/departments/{id}

- CommonCode(공통코드)
  - 코드 그룹 생성(POST) : http://localhost:8080/api/codes/groups

  ```
  {
    "groupCode": "EMPLOYEE_STATUS",
    "groupName": "직원 상태",
    "description": "직원의 재직 상태 코드"
  }
  ```

  - 코드 값 추가(POST) : http://localhost:8080/api/groups/EMPLOYEE_STATUS/codes

  ```
  {
    "code": "ACTIVE", "codeName": "재직중", "sortOrder": 1
  }
  {
    "code": "ACTIVE", "codeName": "휴직", "sortOrder": 2
  }
  {
    "code": "ACTIVE", "codeName": "퇴직", "sortOrder": 3
  }
  ```

  - 코드 목록 조회(GET) : http://localhost:8080/api/codes/EMPLOYEE_STATUS/codes
  - 발주 상태 미리 만들기(POST) :
    http://localhost:8080/api/codes/groups

  ```
  {
    "groupCode": "ORDER_STATUS", "groupName": "발주 상태"
  }
  ```

  http://localhost:8080/api/codes/groups/ORDER_STATUS/codes

  ```
  {
    "code": "DRAFT", "codeName": "임시저장", "sortOrder": 1
  }
  {
    "code": "PENDING", "codeName": "승인대기", "sortOrder": 2
  }
  {
    "code": "APPROVED", "codeName": "승인완료", "sortOrder": 3
  }
  ```
