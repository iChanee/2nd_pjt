package com.dfs.aqua.service;

import com.dfs.aqua.entity.FishSession;
import com.dfs.aqua.entity.User;
import com.dfs.aqua.repository.FishSessionRepository;
import com.dfs.aqua.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class FishSessionService {

    @Autowired
    private FishSessionRepository fishSessionRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * 어항 입장 (세션 생성)
     */
    public FishSession joinAquarium(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("존재하지 않는 사용자입니다."));

        // 기존 활성 세션이 있으면 오프라인으로 변경
        Optional<FishSession> existingSession = fishSessionRepository.findActiveSessionByUserId(userId);
        if (existingSession.isPresent()) {
            FishSession session = existingSession.get();
            session.goOffline();
            fishSessionRepository.save(session);
        }

        // 새 세션 생성
        String sessionToken = UUID.randomUUID().toString();
        FishSession newSession = new FishSession(user, sessionToken);
        
        // 랜덤 초기 위치 설정 (10-90% 범위)
        BigDecimal randomX = BigDecimal.valueOf(10 + Math.random() * 80);
        BigDecimal randomY = BigDecimal.valueOf(10 + Math.random() * 80);
        newSession.updatePosition(randomX, randomY);

        return fishSessionRepository.save(newSession);
    }

    /**
     * 어항 퇴장 (세션 오프라인)
     */
    public void leaveAquarium(Long userId) {
        Optional<FishSession> activeSession = fishSessionRepository.findActiveSessionByUserId(userId);
        if (activeSession.isPresent()) {
            FishSession session = activeSession.get();
            session.goOffline();
            fishSessionRepository.save(session);
        }
    }

    /**
     * 세션 완전 삭제 (로그아웃 시 사용)
     */
    public void deleteUserSessions(Long userId) {
        Optional<FishSession> activeSession = fishSessionRepository.findActiveSessionByUserId(userId);
        if (activeSession.isPresent()) {
            fishSessionRepository.delete(activeSession.get());
        }
        
        // 혹시 오프라인 세션들도 모두 삭제
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("존재하지 않는 사용자입니다."));
        fishSessionRepository.markUserSessionsOffline(user);
        
        // 해당 사용자의 모든 오프라인 세션 삭제
        List<FishSession> userSessions = fishSessionRepository.findAll().stream()
                .filter(session -> session.getUser().getId().equals(userId))
                .toList();
        fishSessionRepository.deleteAll(userSessions);
    }

    /**
     * 세션 토큰으로 세션 조회
     */
    @Transactional(readOnly = true)
    public Optional<FishSession> getSessionByToken(String sessionToken) {
        return fishSessionRepository.findBySessionToken(sessionToken);
    }

    /**
     * 사용자의 활성 세션 조회
     */
    @Transactional(readOnly = true)
    public Optional<FishSession> getActiveSession(Long userId) {
        return fishSessionRepository.findActiveSessionByUserId(userId);
    }

    /**
     * 모든 온라인 세션 조회 (다른 물고기들)
     */
    @Transactional(readOnly = true)
    public List<FishSession> getAllOnlineSessions() {
        return fishSessionRepository.findAllOnlineSessionsWithUser();
    }

    /**
     * 물고기 위치 업데이트
     */
    public FishSession updatePosition(String sessionToken, BigDecimal x, BigDecimal y) {
        FishSession session = fishSessionRepository.findBySessionToken(sessionToken)
                .orElseThrow(() -> new RuntimeException("유효하지 않은 세션입니다."));

        if (!session.getIsOnline()) {
            throw new RuntimeException("오프라인 세션입니다.");
        }

        // 위치 범위 검증 (0-100)
        if (x.compareTo(BigDecimal.ZERO) < 0 || x.compareTo(BigDecimal.valueOf(100)) > 0 ||
            y.compareTo(BigDecimal.ZERO) < 0 || y.compareTo(BigDecimal.valueOf(100)) > 0) {
            throw new RuntimeException("위치는 0-100 범위여야 합니다.");
        }

        session.updatePosition(x, y);
        return fishSessionRepository.save(session);
    }

    /**
     * 세션 활동 시간 업데이트 (하트비트)
     */
    public void updateActivity(String sessionToken) {
        FishSession session = fishSessionRepository.findBySessionToken(sessionToken)
                .orElseThrow(() -> new RuntimeException("유효하지 않은 세션입니다."));

        if (session.getIsOnline()) {
            session.setLastActivityAt(LocalDateTime.now());
            fishSessionRepository.save(session);
        }
    }

    /**
     * 비활성 세션 정리 (5분 이상 비활성)
     */
    public int cleanupInactiveSessions() {
        LocalDateTime cutoffTime = LocalDateTime.now().minusMinutes(5);
        return fishSessionRepository.markInactiveSessionsOffline(cutoffTime);
    }

    /**
     * 사용자를 오프라인으로 설정 (로그아웃 시 사용)
     */
    public void setUserOffline(Long userId) {
        Optional<FishSession> activeSession = fishSessionRepository.findActiveSessionByUserId(userId);
        if (activeSession.isPresent()) {
            FishSession session = activeSession.get();
            session.goOffline();
            fishSessionRepository.save(session);
        }
    }

    /**
     * 온라인 사용자 수 조회
     */
    @Transactional(readOnly = true)
    public long getOnlineUserCount() {
        return fishSessionRepository.countByIsOnlineTrue();
    }
}