package com.dfs.aqua.scheduler;

import com.dfs.aqua.service.ChatService;
import com.dfs.aqua.service.FishSessionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class SessionCleanupScheduler {

    private static final Logger logger = LoggerFactory.getLogger(SessionCleanupScheduler.class);

    @Autowired
    private FishSessionService fishSessionService;

    @Autowired
    private ChatService chatService;

    /**
     * 5분마다 비활성 세션 정리 및 오래된 채팅 메시지 삭제
     */
    @Scheduled(fixedRate = 300000) // 5분 = 300,000ms
    public void cleanupInactiveSessions() {
        try {
            logger.debug("비활성 세션 및 채팅 메시지 정리 작업 시작");
            
            // 1. 비활성 세션 정리 (5분 이상 활동 없음)
            int inactiveSessionCount = fishSessionService.cleanupInactiveSessions();
            if (inactiveSessionCount > 0) {
                logger.info("비활성 세션 {}개를 오프라인으로 변경했습니다.", inactiveSessionCount);
            }

            // 2. 5분 이상된 채팅 메시지 삭제
            int deletedMessageCount = chatService.deleteMessagesOlderThan5Minutes();
            if (deletedMessageCount > 0) {
                logger.info("5분 이상된 채팅 메시지 {}개가 삭제되었습니다.", deletedMessageCount);
            }

            // 3. 현재 온라인 사용자 수 로깅
            long onlineUserCount = fishSessionService.getOnlineUserCount();
            logger.debug("현재 온라인 사용자 수: {}", onlineUserCount);
            
        } catch (Exception e) {
            logger.error("세션 및 채팅 정리 중 오류 발생", e);
        }
    }

    /**
     * 1시간마다 오래된 오프라인 세션 완전 삭제
     */
    @Scheduled(fixedRate = 3600000) // 1시간 = 3,600,000ms
    public void deleteOldOfflineSessions() {
        try {
            logger.debug("오래된 오프라인 세션 삭제 작업 시작");
            
            // 1시간 이전의 오프라인 세션들 완전 삭제
            int deletedSessionCount = fishSessionService.deleteOldOfflineSessions();
            if (deletedSessionCount > 0) {
                logger.info("1시간 이상된 오프라인 세션 {}개가 삭제되었습니다.", deletedSessionCount);
            }
            
        } catch (Exception e) {
            logger.error("오래된 세션 삭제 중 오류 발생", e);
        }
    }

    /**
     * 매일 자정에 오래된 데이터 대청소
     */
    @Scheduled(cron = "0 0 0 * * *") // 매일 자정
    public void dailyCleanup() {
        try {
            logger.info("일일 데이터 정리 작업 시작");
            
            // 30일 이상된 채팅 메시지 소프트 삭제
            int oldMessageCount = chatService.cleanupOldMessages();
            if (oldMessageCount > 0) {
                logger.info("30일 이상된 채팅 메시지 {}개를 소프트 삭제했습니다.", oldMessageCount);
            }
            
            logger.info("일일 데이터 정리 작업 완료");
            
        } catch (Exception e) {
            logger.error("일일 정리 작업 중 오류 발생", e);
        }
    }
}