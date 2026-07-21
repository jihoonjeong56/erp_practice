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