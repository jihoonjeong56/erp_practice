# ERP Practice

Spring Boot + React 기반 소규모 제조업 ERP 시스템 포트폴리오

---

## 프로젝트 정보

| 항목 | 내용 |
|------|------|
| 목적 | 백엔드 개발자 취업 포트폴리오 |
| 개발 방식 | 1인 개발 |
| 개발 기간 | 2026.06 ~ 진행중 |
| API 테스트 | Chrome Talend API Tester |

---

## 기술 스택

### Backend

| 기술 | 버전 | 설명 |
|------|------|------|
| Java | 17 | LTS 버전 |
| Spring Boot | 3.5.14 | 메인 프레임워크 |
| Spring Security | 6.x | 인증 및 인가 |
| Spring Data JPA | 3.x | ORM |
| QueryDSL | 5.0.0 | 동적 쿼리 |
| JWT (jjwt) | 0.12.3 | 토큰 기반 인증 |
| H2 | - | 로컬 개발용 인메모리 DB |
| MySQL | 8.x | 운영 DB |
| Lombok | - | 보일러플레이트 제거 |
| Spring Validation | - | 입력값 유효성 검사 |
| spring-dotenv | 4.0.0 | 환경변수 관리 |
| Gradle | 8.x | 빌드 도구 |

### Frontend

| 기술 | 버전 | 설명 |
|------|------|------|
| React | 18.x | UI 프레임워크 |
| TypeScript | 5.x | 타입 안전성 |
| Vite | 5.x | 빌드 도구 |
| Tailwind CSS | 4.x | 스타일링 |
| Zustand | - | 전역 상태 관리 |
| Axios | - | HTTP 통신 |
| React Router DOM | - | 클라이언트 라우팅 |
| Heroicons | - | 아이콘 |

---

## 프로젝트 구조

```
erp_practice/
├── erp/                # Spring Boot 백엔드 (8080)
│   └── src/main/java/com/example/erp
│       ├── common/     # 공통 기반
│       └── domain/     # 도메인별 기능
│           ├── user/
│           ├── department/
│           └── code/
└── erp-front/          # React 프론트엔드 (5173)
    └── src/
        ├── api/        # API 호출 함수
        ├── components/ # 공통 컴포넌트
        ├── pages/      # 페이지 컴포넌트
        ├── router/     # 라우팅 설정
        ├── store/      # 전역 상태
        └── types/      # TypeScript 타입
```

---

## 실행 방법

```bash
# 백엔드
cd erp
./gradlew bootRun

# 프론트엔드
cd erp-front
npm run dev
```

### 환경변수 설정 (`.env`)

```
JWT_SECRET=your-secret-key-here
JWT_EXPIRATION=86400000
```

### 프로파일

| 프로파일 | DB | 용도 |
|----------|-----|------|
| local | H2 인메모리 | 로컬 개발 |
| dev | MySQL | 개발 서버 |

---

## 테스트 계정

| username | password | role | status |
|----------|----------|------|--------|
| admin | password123 | ADMIN | ACTIVE |
| manager01 | password123 | MANAGER | ACTIVE |
| user01 | password123 | USER | ACTIVE |
| user02 | password123 | USER | ACTIVE |
| user03 | password123 | USER | INACTIVE |

---

## 구현 현황

### Phase 1 - 기반 구축

**공통 기반**
- [x] 공통 응답 포맷 ApiResponse
- [x] 에러 코드 관리 ErrorCode enum
- [x] 전역 예외 처리 GlobalExceptionHandler
- [x] JPA Auditing BaseTimeEntity
- [x] JWT 인증 필터
- [x] Spring Security 설정 (Stateless)
- [x] CORS 설정
- [x] 환경변수 관리 (.env)

**인증 / 회원**
- [x] 회원가입
- [x] 로그인 (JWT 발급)
- [x] 내 정보 조회
- [x] BCrypt 비밀번호 암호화
- [x] 역할 기반 권한 구분 (ADMIN / MANAGER / USER)
- [x] OAuth2 대비 email / provider / providerId 필드 설계

**부서 관리**
- [x] 부서 등록 (최상위 / 하위 부서)
- [x] 부서 수정 / 삭제
- [x] 전체 목록 조회
- [x] 트리 구조 조회 (셀프 조인)
- [x] 하위 부서 존재 시 삭제 불가 처리

**공통 코드 관리**
- [x] 코드 그룹 등록 / 수정 / 조회
- [x] 공통 코드 등록 / 수정 / 삭제 / 조회
- [x] Cacheable 캐시 적용 구조

**프론트엔드**
- [x] 로그인 / 회원가입 페이지
- [x] 공통 레이아웃 (사이드바 + 헤더)
- [x] JWT 토큰 자동 주입 (Axios 인터셉터)
- [x] Private Route (미인증 시 리다이렉트)
- [x] 부서 관리 페이지 (목록 / 등록 / 수정 / 삭제)
- [x] 대시보드 페이지 (기본)

---

### Phase 2 - 핵심 업무 모듈 (예정)

**직원 / 조직 관리**
- [ ] 직급 CRUD
- [ ] 직원 CRUD
- [ ] 직원 검색 필터 (QueryDSL)
- [ ] 직원 엑셀 다운로드

**재고 / 자재 관리**
- [ ] 재고 등록 / 조회
- [ ] 입출고 처리
- [ ] 재고 동시성 처리 (비관적 락)

**발주 / 구매 관리**
- [ ] 발주 등록
- [ ] 발주 상태 머신 (DRAFT → PENDING → APPROVED → COMPLETED)
- [ ] 승인 플로우

**생산 지시 관리**
- [ ] 작업 지시 등록
- [ ] BOM 관리
- [ ] 공정 추적

---

### Phase 3 - 고급 기능 (예정)

- [ ] 대시보드 KPI 통계 API 연동
- [ ] 실시간 알림 (SSE / WebSocket)
- [ ] 엑셀 업 / 다운로드 (Apache POI)
- [ ] Redis 캐시 적용
- [ ] JWT 블랙리스트 (로그아웃 처리)
- [ ] OAuth2 소셜 로그인

---

### DevOps (예정)

- [ ] Docker 컨테이너화
- [ ] GitHub Actions CI/CD
- [ ] AWS EC2 + RDS 배포

---

## API 명세

### 인증

| Method | URI | 설명 | 인증 |
|--------|-----|------|------|
| POST | /api/auth/signup | 회원가입 | 불필요 |
| POST | /api/auth/login | 로그인 | 불필요 |
| GET | /api/auth/me | 내 정보 조회 | 필요 |

```json
// 회원가입
POST /api/auth/signup
{
  "username": "admin01",
  "password": "password123",
  "name": "홍길동",
  "email": "hong@example.com"
}

// 로그인
POST /api/auth/login
{
  "username": "admin01",
  "password": "password123"
}
```

---

### 부서

| Method | URI | 설명 | 인증 |
|--------|-----|------|------|
| POST | /api/departments | 부서 등록 | 필요 |
| PUT | /api/departments/{id} | 부서 수정 | 필요 |
| DELETE | /api/departments/{id} | 부서 삭제 | 필요 |
| GET | /api/departments | 전체 목록 | 필요 |
| GET | /api/departments/{id} | 단건 조회 | 필요 |
| GET | /api/departments/tree | 트리 구조 | 필요 |

```json
// 최상위 부서 등록
POST /api/departments
{
  "deptCode": "HQ",
  "deptName": "본사",
  "sortOrder": 1
}

// 하위 부서 등록
POST /api/departments
{
  "deptCode": "DEV",
  "deptName": "개발팀",
  "sortOrder": 1,
  "parentId": 1
}
```

---

### 공통 코드

| Method | URI | 설명 | 인증 |
|--------|-----|------|------|
| POST | /api/codes/groups | 코드 그룹 등록 | 필요 |
| GET | /api/codes/groups | 코드 그룹 전체 조회 | 필요 |
| GET | /api/codes/groups/{groupCode} | 코드 그룹 단건 조회 | 필요 |
| PUT | /api/codes/groups/{groupCode} | 코드 그룹 수정 | 필요 |
| POST | /api/codes/groups/{groupCode}/codes | 코드 값 등록 | 필요 |
| GET | /api/codes/groups/{groupCode}/codes | 코드 값 목록 조회 | 필요 |
| PUT | /api/codes/groups/{groupCode}/codes/{id} | 코드 값 수정 | 필요 |
| DELETE | /api/codes/groups/{groupCode}/codes/{id} | 코드 값 삭제 | 필요 |

```json
// 코드 그룹 등록
POST /api/codes/groups
{
  "groupCode": "EMPLOYEE_STATUS",
  "groupName": "직원 상태",
  "description": "직원의 재직 상태 코드"
}

// 코드 값 등록
POST /api/codes/groups/EMPLOYEE_STATUS/codes
{
  "code": "ACTIVE",
  "codeName": "재직중",
  "sortOrder": 1
}
```