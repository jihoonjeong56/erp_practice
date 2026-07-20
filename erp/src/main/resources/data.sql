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