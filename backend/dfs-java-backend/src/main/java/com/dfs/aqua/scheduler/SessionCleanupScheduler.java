package com.dfs.aqua.scheduler;

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

    /**
     * 5분마다 비활성 세션 정리
     */
    @Scheduled(fixedRate = 300000) // 5분 = 300,000ms
    public void cleanupInactiveSessions() {
        try {
            int cleanedCount = fishSessionService.cleanupInactiveSessions();
            if (cleanedCount > 0) {
                logger.info("비활성 세션 {}개가 정리되었습니다.", cleanedCount);
            }
        } catch (Exception e) {
            logger.error("세션 정리 중 오류 발생", e);
        }
    }

    /**
     * 매일 자정에 오래된 오프라인 세션 삭제
     */
    @Scheduled(cron = "0 0 0 * * *") // 매일 자정
    public void deleteOldOfflineSessions() {
        try {
            // 24시간 이전의 오프라인 세션들 삭제
            // 이 기능은 FishSessionService에 추가 구현 필요
            logger.info("오래된 오프라인 세션 정리 작업 실행");
        } catch (Exception e) {
            logger.error("오래된 세션 삭제 중 오류 발생", e);
        }
    }
}