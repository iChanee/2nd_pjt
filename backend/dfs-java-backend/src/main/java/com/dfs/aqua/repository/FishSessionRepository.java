package com.dfs.aqua.repository;

import com.dfs.aqua.entity.FishSession;
import com.dfs.aqua.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface FishSessionRepository extends JpaRepository<FishSession, Long> {
    
    /**
     * 세션 토큰으로 세션 찾기
     */
    Optional<FishSession> findBySessionToken(String sessionToken);
    
    /**
     * 사용자의 활성 세션 찾기
     */
    Optional<FishSession> findByUserAndIsOnlineTrue(User user);
    
    /**
     * 사용자 ID로 활성 세션 찾기
     */
    @Query("SELECT fs FROM FishSession fs WHERE fs.user.id = :userId AND fs.isOnline = true")
    Optional<FishSession> findActiveSessionByUserId(@Param("userId") Long userId);
    
    /**
     * 모든 온라인 세션 조회 (사용자 정보 포함)
     */
    @Query("SELECT fs FROM FishSession fs JOIN FETCH fs.user WHERE fs.isOnline = true ORDER BY fs.joinedAt")
    List<FishSession> findAllOnlineSessionsWithUser();
    
    /**
     * 온라인 세션 수 조회
     */
    long countByIsOnlineTrue();
    
    /**
     * 특정 시간 이전에 활동한 세션들을 오프라인으로 변경
     */
    @Modifying
    @Query("UPDATE FishSession fs SET fs.isOnline = false WHERE fs.isOnline = true AND fs.lastActivityAt < :cutoffTime")
    int markInactiveSessionsOffline(@Param("cutoffTime") LocalDateTime cutoffTime);
    
    /**
     * 사용자의 모든 세션을 오프라인으로 변경
     */
    @Modifying
    @Query("UPDATE FishSession fs SET fs.isOnline = false WHERE fs.user = :user")
    int markUserSessionsOffline(@Param("user") User user);
    
    /**
     * 오프라인 세션들 삭제 (정리용)
     */
    @Modifying
    @Query("DELETE FROM FishSession fs WHERE fs.isOnline = false AND fs.lastActivityAt < :cutoffTime")
    int deleteOldOfflineSessions(@Param("cutoffTime") LocalDateTime cutoffTime);
}