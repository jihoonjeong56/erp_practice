-- =============================================
-- ERP 샘플 데이터 - 테스트용 회원
-- 비밀번호는 모두 'password123' (BCrypt 암호화)
-- =============================================

-- 기존 데이터 초기화 (H2 사용 시)
-- DELETE FROM users;

INSERT INTO users (username, password, name, email, role, status, created_at, updated_at)
VALUES
    -- 관리자
    ('admin',
     '$2b$10$89KmBhYrOqDKWpzRKkzS4Oq03JInoJKP4LcedYZzWA4Uc.x//Gm7m',
     '관리자',
     'admin@erp.com',
     'ADMIN',
     'ACTIVE',
     NOW(),
     NOW()),

    -- 매니저
    ('manager01',
     '$2b$10$89KmBhYrOqDKWpzRKkzS4Oq03JInoJKP4LcedYZzWA4Uc.x//Gm7m',
     '김매니저',
     'manager01@erp.com',
     'MANAGER',
     'ACTIVE',
     NOW(),
     NOW()),

    -- 일반 사용자
    ('user01',
     '$2b$10$89KmBhYrOqDKWpzRKkzS4Oq03JInoJKP4LcedYZzWA4Uc.x//Gm7m',
     '이사원',
     'user01@erp.com',
     'USER',
     'ACTIVE',
     NOW(),
     NOW()),

    ('user02',
     '$2b$10$89KmBhYrOqDKWpzRKkzS4Oq03JInoJKP4LcedYZzWA4Uc.x//Gm7m',
     '박사원',
     'user02@erp.com',
     'USER',
     'ACTIVE',
     NOW(),
     NOW()),

    -- 비활성 사용자 (테스트용)
    ('user03',
     '$2b$10$89KmBhYrOqDKWpzRKkzS4Oq03JInoJKP4LcedYZzWA4Uc.x//Gm7m',
     '최비활성',
     'user03@erp.com',
     'USER',
     'INACTIVE',
     NOW(),
     NOW());

-- =============================================
-- 테스트 계정 정보
-- =============================================
-- username  | password    | role    | status
-- -----------------------------------------------
-- admin     | password123 | ADMIN   | ACTIVE
-- manager01 | password123 | MANAGER | ACTIVE
-- user01    | password123 | USER    | ACTIVE
-- user02    | password123 | USER    | ACTIVE
-- user03    | password123 | USER    | INACTIVE

-- =============================================
-- ERP 샘플 데이터 - 부서 (제조업 기준)
-- parent_id가 NULL이면 최상위 부서
-- =============================================

-- 1. 최상위 부서 (본사)
INSERT INTO department (dept_code, dept_name, description, sort_order, use_yn, parent_id, created_at, updated_at)
VALUES ('HQ', '본사', '본사 최상위 조직', 1, 'Y', NULL, NOW(), NOW());

-- 2. 1단계 하위 부서 (본사 산하)
INSERT INTO department (dept_code, dept_name, description, sort_order, use_yn, parent_id, created_at, updated_at)
VALUES
    ('MGMT',    '경영지원본부',  '경영 전반 지원',       1, 'Y', (SELECT id FROM department WHERE dept_code = 'HQ'), NOW(), NOW()),
    ('PROD',    '생산본부',     '제품 생산 총괄',        2, 'Y', (SELECT id FROM department WHERE dept_code = 'HQ'), NOW(), NOW()),
    ('SALES',   '영업본부',     '영업 및 마케팅 총괄',   3, 'Y', (SELECT id FROM department WHERE dept_code = 'HQ'), NOW(), NOW()),
    ('RND',     '연구개발본부',  '제품 연구 및 개발',     4, 'Y', (SELECT id FROM department WHERE dept_code = 'HQ'), NOW(), NOW()),
    ('QUALITY', '품질관리본부',  '품질 관리 및 검사',     5, 'Y', (SELECT id FROM department WHERE dept_code = 'HQ'), NOW(), NOW());

-- 3. 2단계 하위 부서 (경영지원본부 산하)
INSERT INTO department (dept_code, dept_name, description, sort_order, use_yn, parent_id, created_at, updated_at)
VALUES
    ('HR',      '인사팀',   '채용 및 인사 관리',    1, 'Y', (SELECT id FROM department WHERE dept_code = 'MGMT'), NOW(), NOW()),
    ('FINANCE', '재무팀',   '재무 및 회계 관리',    2, 'Y', (SELECT id FROM department WHERE dept_code = 'MGMT'), NOW(), NOW()),
    ('IT',      'IT팀',     '시스템 및 인프라 관리', 3, 'Y', (SELECT id FROM department WHERE dept_code = 'MGMT'), NOW(), NOW());

-- 4. 2단계 하위 부서 (생산본부 산하)
INSERT INTO department (dept_code, dept_name, description, sort_order, use_yn, parent_id, created_at, updated_at)
VALUES
    ('PROD1',   '1공장',    '제1 생산 라인',   1, 'Y', (SELECT id FROM department WHERE dept_code = 'PROD'), NOW(), NOW()),
    ('PROD2',   '2공장',    '제2 생산 라인',   2, 'Y', (SELECT id FROM department WHERE dept_code = 'PROD'), NOW(), NOW()),
    ('STOCK',   '자재창고팀', '자재 입출고 관리', 3, 'Y', (SELECT id FROM department WHERE dept_code = 'PROD'), NOW(), NOW());

-- 5. 2단계 하위 부서 (영업본부 산하)
INSERT INTO department (dept_code, dept_name, description, sort_order, use_yn, parent_id, created_at, updated_at)
VALUES
    ('SALES1',  '국내영업팀', '국내 영업 담당',   1, 'Y', (SELECT id FROM department WHERE dept_code = 'SALES'), NOW(), NOW()),
    ('SALES2',  '해외영업팀', '해외 수출 담당',   2, 'Y', (SELECT id FROM department WHERE dept_code = 'SALES'), NOW(), NOW()),
    ('MKT',     '마케팅팀',  '브랜드 및 홍보',   3, 'Y', (SELECT id FROM department WHERE dept_code = 'SALES'), NOW(), NOW());

-- 6. 미사용 부서 (테스트용)
INSERT INTO department (dept_code, dept_name, description, sort_order, use_yn, parent_id, created_at, updated_at)
VALUES
    ('OLD_DEPT', '구매팀(폐지)', '폐지된 구매팀', 99, 'N', NULL, NOW(), NOW());

-- =============================================
-- 부서 구조
-- =============================================
-- HQ 본사
-- ├── MGMT 경영지원본부
-- │   ├── HR 인사팀
-- │   ├── FINANCE 재무팀
-- │   └── IT IT팀
-- ├── PROD 생산본부
-- │   ├── PROD1 1공장
-- │   ├── PROD2 2공장
-- │   └── STOCK 자재창고팀
-- ├── SALES 영업본부
-- │   ├── SALES1 국내영업팀
-- │   ├── SALES2 해외영업팀
-- │   └── MKT 마케팅팀
-- ├── RND 연구개발본부
-- ├── QUALITY 품질관리본부
-- └── OLD_DEPT 구매팀(폐지) [useYn=N]


-- =============================================
-- ERP 샘플 데이터 - 직급 (Position)
-- level: 높을수록 상위 직급
-- =============================================

INSERT INTO position (pos_code, pos_name, level, use_yn, created_at, updated_at)
VALUES
    ('CEO',      '대표이사', 10, 'Y', NOW(), NOW()),
    ('DIRECTOR', '이사',      8, 'Y', NOW(), NOW()),
    ('GENERAL',  '부장',      6, 'Y', NOW(), NOW()),
    ('MANAGER',  '과장',      5, 'Y', NOW(), NOW()),
    ('ASSISTANT','대리',      4, 'Y', NOW(), NOW()),
    ('SENIOR',   '주임',      3, 'Y', NOW(), NOW()),
    ('STAFF',    '사원',      1, 'Y', NOW(), NOW());

-- =============================================
-- ERP 샘플 데이터 - 직원 (Employee)
-- dept_id, position_id는 앞서 입력한 부서/직급 데이터 기준
-- =============================================

INSERT INTO employee (emp_no, emp_name, email, phone, dept_id, position_id, hire_date, status, created_at, updated_at)
VALUES
    -- 본사 (HQ) - 대표이사
    ('EMP2020001', '김대표', 'kim.ceo@erp.com', '010-1000-0001',
     (SELECT id FROM department WHERE dept_code = 'HQ'),
     (SELECT id FROM position WHERE pos_code = 'CEO'),
     '2020-01-02 09:00:00', 'ACTIVE', NOW(), NOW()),

    -- 경영지원본부 (MGMT)
    ('EMP2020002', '이이사', 'lee.dir@erp.com', '010-1000-0002',
     (SELECT id FROM department WHERE dept_code = 'MGMT'),
     (SELECT id FROM position WHERE pos_code = 'DIRECTOR'),
     '2020-03-01 09:00:00', 'ACTIVE', NOW(), NOW()),

    -- 인사팀 (HR)
    ('EMP2021001', '박부장', 'park.hr@erp.com', '010-1000-0003',
     (SELECT id FROM department WHERE dept_code = 'HR'),
     (SELECT id FROM position WHERE pos_code = 'GENERAL'),
     '2021-01-04 09:00:00', 'ACTIVE', NOW(), NOW()),

    ('EMP2022001', '최과장', 'choi.hr@erp.com', '010-1000-0004',
     (SELECT id FROM department WHERE dept_code = 'HR'),
     (SELECT id FROM position WHERE pos_code = 'MANAGER'),
     '2022-03-02 09:00:00', 'ACTIVE', NOW(), NOW()),

    ('EMP2024001', '정사원', 'jung.hr@erp.com', '010-1000-0005',
     (SELECT id FROM department WHERE dept_code = 'HR'),
     (SELECT id FROM position WHERE pos_code = 'STAFF'),
     '2024-01-02 09:00:00', 'ACTIVE', NOW(), NOW()),

    -- 재무팀 (FINANCE)
    ('EMP2021002', '강부장', 'kang.fin@erp.com', '010-1000-0006',
     (SELECT id FROM department WHERE dept_code = 'FINANCE'),
     (SELECT id FROM position WHERE pos_code = 'GENERAL'),
     '2021-02-01 09:00:00', 'ACTIVE', NOW(), NOW()),

    ('EMP2023001', '윤대리', 'yoon.fin@erp.com', '010-1000-0007',
     (SELECT id FROM department WHERE dept_code = 'FINANCE'),
     (SELECT id FROM position WHERE pos_code = 'ASSISTANT'),
     '2023-07-03 09:00:00', 'ACTIVE', NOW(), NOW()),

    -- IT팀 (IT)
    ('EMP2021003', '임과장', 'lim.it@erp.com', '010-1000-0008',
     (SELECT id FROM department WHERE dept_code = 'IT'),
     (SELECT id FROM position WHERE pos_code = 'MANAGER'),
     '2021-04-01 09:00:00', 'ACTIVE', NOW(), NOW()),

    ('EMP2022002', '한주임', 'han.it@erp.com', '010-1000-0009',
     (SELECT id FROM department WHERE dept_code = 'IT'),
     (SELECT id FROM position WHERE pos_code = 'SENIOR'),
     '2022-07-04 09:00:00', 'ACTIVE', NOW(), NOW()),

    ('EMP2024002', '오사원', 'oh.it@erp.com', '010-1000-0010',
     (SELECT id FROM department WHERE dept_code = 'IT'),
     (SELECT id FROM position WHERE pos_code = 'STAFF'),
     '2024-03-04 09:00:00', 'ACTIVE', NOW(), NOW()),

    -- 1공장 (PROD1)
    ('EMP2020003', '서부장', 'seo.prod1@erp.com', '010-1000-0011',
     (SELECT id FROM department WHERE dept_code = 'PROD1'),
     (SELECT id FROM position WHERE pos_code = 'GENERAL'),
     '2020-05-04 09:00:00', 'ACTIVE', NOW(), NOW()),

    ('EMP2021004', '신과장', 'shin.prod1@erp.com', '010-1000-0012',
     (SELECT id FROM department WHERE dept_code = 'PROD1'),
     (SELECT id FROM position WHERE pos_code = 'MANAGER'),
     '2021-06-01 09:00:00', 'ACTIVE', NOW(), NOW()),

    ('EMP2023002', '권사원', 'kwon.prod1@erp.com', '010-1000-0013',
     (SELECT id FROM department WHERE dept_code = 'PROD1'),
     (SELECT id FROM position WHERE pos_code = 'STAFF'),
     '2023-01-02 09:00:00', 'ACTIVE', NOW(), NOW()),

    -- 2공장 (PROD2)
    ('EMP2021005', '황과장', 'hwang.prod2@erp.com', '010-1000-0014',
     (SELECT id FROM department WHERE dept_code = 'PROD2'),
     (SELECT id FROM position WHERE pos_code = 'MANAGER'),
     '2021-08-02 09:00:00', 'ACTIVE', NOW(), NOW()),

    ('EMP2022003', '안대리', 'ahn.prod2@erp.com', '010-1000-0015',
     (SELECT id FROM department WHERE dept_code = 'PROD2'),
     (SELECT id FROM position WHERE pos_code = 'ASSISTANT'),
     '2022-09-01 09:00:00', 'ACTIVE', NOW(), NOW()),

    -- 국내영업팀 (SALES1)
    ('EMP2020004', '송부장', 'song.sales@erp.com', '010-1000-0016',
     (SELECT id FROM department WHERE dept_code = 'SALES1'),
     (SELECT id FROM position WHERE pos_code = 'GENERAL'),
     '2020-07-01 09:00:00', 'ACTIVE', NOW(), NOW()),

    ('EMP2022004', '노과장', 'noh.sales@erp.com', '010-1000-0017',
     (SELECT id FROM department WHERE dept_code = 'SALES1'),
     (SELECT id FROM position WHERE pos_code = 'MANAGER'),
     '2022-02-07 09:00:00', 'ACTIVE', NOW(), NOW()),

    -- 연구개발본부 (RND)
    ('EMP2020005', '류이사', 'ryu.rnd@erp.com', '010-1000-0018',
     (SELECT id FROM department WHERE dept_code = 'RND'),
     (SELECT id FROM position WHERE pos_code = 'DIRECTOR'),
     '2020-09-01 09:00:00', 'ACTIVE', NOW(), NOW()),

    ('EMP2022005', '전주임', 'jeon.rnd@erp.com', '010-1000-0019',
     (SELECT id FROM department WHERE dept_code = 'RND'),
     (SELECT id FROM position WHERE pos_code = 'SENIOR'),
     '2022-11-01 09:00:00', 'ACTIVE', NOW(), NOW()),

    -- 휴직 직원 (테스트용)
    ('EMP2021006', '조대리', 'cho.leave@erp.com', '010-1000-0020',
     (SELECT id FROM department WHERE dept_code = 'HR'),
     (SELECT id FROM position WHERE pos_code = 'ASSISTANT'),
     '2021-03-02 09:00:00', 'LEAVE', NOW(), NOW()),

    -- 퇴직 직원 (테스트용)
    ('EMP2019001', '구사원', 'koo.resigned@erp.com', '010-1000-0021',
     (SELECT id FROM department WHERE dept_code = 'SALES1'),
     (SELECT id FROM position WHERE pos_code = 'STAFF'),
     '2019-04-01 09:00:00', 'RESIGNED', NOW(), NOW());

-- =============================================
-- 직원 현황 요약
-- =============================================
-- 총 직원 수    : 21명
-- ACTIVE        : 19명
-- LEAVE  (휴직) : 1명
-- RESIGNED(퇴직): 1명
--
-- 부서별 직원 수
-- HQ      : 1명 (대표이사)
-- MGMT    : 1명 (이사)
-- HR      : 4명 (부장, 과장, 사원, 대리-휴직)
-- FINANCE : 2명 (부장, 대리)
-- IT      : 3명 (과장, 주임, 사원)
-- PROD1   : 3명 (부장, 과장, 사원)
-- PROD2   : 2명 (과장, 대리)
-- SALES1  : 3명 (부장, 과장, 사원-퇴직)
-- RND     : 2명 (이사, 주임)