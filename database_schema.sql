-- =============================================
-- 어항 서비스 데이터베이스 스키마 (최종 정리)
-- =============================================

-- 데이터베이스 생성
CREATE DATABASE IF NOT EXISTS aqua
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE aqua;

-- =============================================
-- 1. 사용자 테이블
-- =============================================
DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '사용자 고유 ID',
    name VARCHAR(50) NOT NULL COMMENT '사용자 이름',
    email VARCHAR(100) NOT NULL UNIQUE COMMENT '이메일 (로그인 ID)',
    password_hash VARCHAR(255) NOT NULL COMMENT 'BCrypt 암호화된 비밀번호',
    fish_type VARCHAR(20) NOT NULL DEFAULT 'goldfish' COMMENT '선택한 물고기 타입',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '가입일시',
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '최종 수정일시',
    
    INDEX idx_email (email),
    INDEX idx_fish_type (fish_type),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='사용자 기본 정보';

-- =============================================
-- 2. 물고기 세션 테이블 (어항 접속 정보)
-- =============================================
DROP TABLE IF EXISTS fish_sessions;
CREATE TABLE fish_sessions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '세션 고유 ID',
    user_id BIGINT NOT NULL COMMENT '사용자 ID (users.id 참조)',
    session_token VARCHAR(255) NOT NULL UNIQUE COMMENT '세션 토큰 (UUID)',
    position_x DECIMAL(5,2) NOT NULL DEFAULT 50.00 COMMENT 'X 좌표 (0.00~100.00 퍼센트)',
    position_y DECIMAL(5,2) NOT NULL DEFAULT 50.00 COMMENT 'Y 좌표 (0.00~100.00 퍼센트)',
    is_online BOOLEAN NOT NULL DEFAULT TRUE COMMENT '온라인 상태 (true: 온라인, false: 오프라인)',
    joined_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '어항 입장 시간',
    last_activity_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '마지막 활동 시간 (하트비트)',
    
    INDEX idx_user_online (user_id, is_online),
    INDEX idx_session_token (session_token),
    INDEX idx_online_activity (is_online, last_activity_at),
    INDEX idx_joined_at (joined_at),
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='물고기 세션 정보 (실시간 어항 접속 상태)';

-- =============================================
-- 3. 채팅 메시지 테이블
-- =============================================
DROP TABLE IF EXISTS chat_messages;
CREATE TABLE chat_messages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '메시지 고유 ID',
    user_id BIGINT NOT NULL COMMENT '메시지 작성자 ID (users.id 참조)',
    message VARCHAR(500) NOT NULL COMMENT '채팅 메시지 내용',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '메시지 작성 시간',
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE COMMENT '삭제 여부 (소프트 삭제)',
    expires_at TIMESTAMP NULL DEFAULT (CURRENT_TIMESTAMP + INTERVAL 30 DAY) COMMENT '메시지 만료 시간 (30일 후)',
    
    INDEX idx_user_created (user_id, created_at),
    INDEX idx_created_deleted (created_at, is_deleted),
    INDEX idx_expires_at (expires_at),
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='채팅 메시지 (물고기 말풍선)';

-- =============================================
-- 테이블별 컬럼 정리
-- =============================================

/*
📋 USERS 테이블 컬럼 상세
┌─────────────────┬──────────────┬─────────────┬─────────────────────────────────┐
│ 컬럼명          │ 타입         │ NULL 여부   │ 설명                            │
├─────────────────┼──────────────┼─────────────┼─────────────────────────────────┤
│ id              │ BIGINT       │ NOT NULL    │ 사용자 고유 ID (자동증가)       │
│ name            │ VARCHAR(50)  │ NOT NULL    │ 사용자 이름                     │
│ email           │ VARCHAR(100) │ NOT NULL    │ 이메일 (로그인 ID, 유니크)      │
│ password_hash   │ VARCHAR(255) │ NOT NULL    │ BCrypt 암호화된 비밀번호        │
│ fish_type       │ VARCHAR(20)  │ NOT NULL    │ 물고기 타입 (기본값: goldfish)  │
│ created_at      │ TIMESTAMP    │ NOT NULL    │ 가입일시                        │
│ updated_at      │ TIMESTAMP    │ NOT NULL    │ 최종 수정일시                   │
└─────────────────┴──────────────┴─────────────┴─────────────────────────────────┘

📋 FISH_SESSIONS 테이블 컬럼 상세
┌─────────────────┬──────────────┬─────────────┬─────────────────────────────────┐
│ 컬럼명          │ 타입         │ NULL 여부   │ 설명                            │
├─────────────────┼──────────────┼─────────────┼─────────────────────────────────┤
│ id              │ BIGINT       │ NOT NULL    │ 세션 고유 ID (자동증가)         │
│ user_id         │ BIGINT       │ NOT NULL    │ 사용자 ID (외래키)              │
│ session_token   │ VARCHAR(255) │ NOT NULL    │ 세션 토큰 (UUID, 유니크)        │
│ position_x      │ DECIMAL(5,2) │ NOT NULL    │ X 좌표 (0.00~100.00%)          │
│ position_y      │ DECIMAL(5,2) │ NOT NULL    │ Y 좌표 (0.00~100.00%)          │
│ is_online       │ BOOLEAN      │ NOT NULL    │ 온라인 상태 (기본값: true)      │
│ joined_at       │ TIMESTAMP    │ NOT NULL    │ 어항 입장 시간                  │
│ last_activity_at│ TIMESTAMP    │ NOT NULL    │ 마지막 활동 시간 (하트비트)     │
└─────────────────┴──────────────┴─────────────┴─────────────────────────────────┘

📋 CHAT_MESSAGES 테이블 컬럼 상세
┌─────────────────┬──────────────┬─────────────┬─────────────────────────────────┐
│ 컬럼명          │ 타입         │ NULL 여부   │ 설명                            │
├─────────────────┼──────────────┼─────────────┼─────────────────────────────────┤
│ id              │ BIGINT       │ NOT NULL    │ 메시지 고유 ID (자동증가)       │
│ user_id         │ BIGINT       │ NOT NULL    │ 작성자 ID (외래키)              │
│ message         │ VARCHAR(500) │ NOT NULL    │ 채팅 메시지 내용                │
│ created_at      │ TIMESTAMP    │ NOT NULL    │ 메시지 작성 시간                │
│ is_deleted      │ BOOLEAN      │ NOT NULL    │ 삭제 여부 (기본값: false)       │
│ expires_at      │ TIMESTAMP    │ NULL        │ 메시지 만료 시간 (30일 후)      │
└─────────────────┴──────────────┴─────────────┴─────────────────────────────────┘
*/

-- =============================================
-- 인덱스 정리
-- =============================================

/*
📋 인덱스 목록
┌─────────────────┬─────────────────────┬─────────────────────────────────┐
│ 테이블          │ 인덱스명            │ 컬럼                            │
├─────────────────┼─────────────────────┼─────────────────────────────────┤
│ users           │ PRIMARY             │ id                              │
│ users           │ email (UNIQUE)      │ email                           │
│ users           │ idx_email           │ email                           │
│ users           │ idx_fish_type       │ fish_type                       │
│ users           │ idx_created_at      │ created_at                      │
├─────────────────┼─────────────────────┼─────────────────────────────────┤
│ fish_sessions   │ PRIMARY             │ id                              │
│ fish_sessions   │ session_token (UNQ) │ session_token                   │
│ fish_sessions   │ idx_user_online     │ user_id, is_online              │
│ fish_sessions   │ idx_session_token   │ session_token                   │
│ fish_sessions   │ idx_online_activity │ is_online, last_activity_at     │
│ fish_sessions   │ idx_joined_at       │ joined_at                       │
├─────────────────┼─────────────────────┼─────────────────────────────────┤
│ chat_messages   │ PRIMARY             │ id                              │
│ chat_messages   │ idx_user_created    │ user_id, created_at             │
│ chat_messages   │ idx_created_deleted │ created_at, is_deleted          │
│ chat_messages   │ idx_expires_at      │ expires_at                      │
└─────────────────┴─────────────────────┴─────────────────────────────────┘
*/

-- =============================================
-- 외래키 제약조건
-- =============================================

/*
📋 외래키 관계
┌─────────────────┬─────────────────┬─────────────────┬─────────────────┐
│ 자식 테이블     │ 자식 컬럼       │ 부모 테이블     │ 부모 컬럼       │
├─────────────────┼─────────────────┼─────────────────┼─────────────────┤
│ fish_sessions   │ user_id         │ users           │ id              │
│ chat_messages   │ user_id         │ users           │ id              │
└─────────────────┴─────────────────┴─────────────────┴─────────────────┘

삭제 정책: CASCADE (부모 삭제 시 자식도 함께 삭제)
*/

-- =============================================
-- 샘플 데이터 (테스트용)
-- =============================================

-- 테스트 사용자 생성
INSERT INTO users (name, email, password_hash, fish_type) VALUES
('장유정', 'ahldb10@gmail.com', '$2a$10$example.hash.for.password', 'crab'),
('세얼간이', 'aridoasis@naver.com', '$2a$10$example.hash.for.password', 'octopus'),
('테스트유저', 'test@example.com', '$2a$10$example.hash.for.password', 'goldfish');

-- =============================================
-- 유용한 쿼리 모음
-- =============================================

-- 1. 현재 온라인 사용자 및 물고기 정보 조회
/*
SELECT 
    u.id,
    u.name,
    u.fish_type,
    fs.position_x,
    fs.position_y,
    fs.joined_at,
    fs.last_activity_at
FROM fish_sessions fs
JOIN users u ON fs.user_id = u.id
WHERE fs.is_online = TRUE
ORDER BY fs.joined_at;
*/

-- 2. 최근 채팅 메시지 조회 (50개)
/*
SELECT 
    cm.id,
    cm.message,
    u.name,
    u.fish_type,
    cm.created_at
FROM chat_messages cm
JOIN users u ON cm.user_id = u.id
WHERE cm.is_deleted = FALSE
ORDER BY cm.created_at DESC
LIMIT 50;
*/

-- 3. 특정 시간 이후 새 메시지 조회 (폴링용)
/*
SELECT 
    cm.id,
    cm.user_id,
    u.name as userName,
    u.fish_type as userFishType,
    cm.message,
    cm.created_at
FROM chat_messages cm
JOIN users u ON cm.user_id = u.id
WHERE cm.is_deleted = FALSE
AND cm.created_at > '2026-01-09 08:00:00'
ORDER BY cm.created_at ASC;
*/

-- 4. 비활성 세션 정리 (5분 이상 비활성)
/*
UPDATE fish_sessions 
SET is_online = FALSE 
WHERE is_online = TRUE 
AND last_activity_at < DATE_SUB(NOW(), INTERVAL 5 MINUTE);
*/

-- 5. 만료된 채팅 메시지 정리
/*
UPDATE chat_messages 
SET is_deleted = TRUE 
WHERE expires_at IS NOT NULL 
AND expires_at < NOW() 
AND is_deleted = FALSE;
*/

-- 6. 물고기 타입별 사용자 통계
/*
SELECT 
    fish_type,
    COUNT(*) as user_count,
    COUNT(CASE WHEN fs.is_online = TRUE THEN 1 END) as online_count
FROM users u
LEFT JOIN fish_sessions fs ON u.id = fs.user_id
GROUP BY fish_type
ORDER BY user_count DESC;
*/