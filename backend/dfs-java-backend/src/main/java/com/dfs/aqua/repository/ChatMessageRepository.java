package com.dfs.aqua.repository;

import com.dfs.aqua.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    /**
     * 최근 채팅 메시지 조회 (삭제되지 않은 것만)
     */
    @Query("SELECT cm FROM ChatMessage cm " +
           "JOIN FETCH cm.user u " +
           "WHERE cm.isDeleted = false " +
           "ORDER BY cm.createdAt DESC")
    List<ChatMessage> findRecentMessages();

    /**
     * 특정 시간 이후의 채팅 메시지 조회
     */
    @Query("SELECT cm FROM ChatMessage cm " +
           "JOIN FETCH cm.user u " +
           "WHERE cm.isDeleted = false " +
           "AND cm.createdAt > :since " +
           "ORDER BY cm.createdAt ASC")
    List<ChatMessage> findMessagesSince(@Param("since") LocalDateTime since);

    /**
     * 최근 N개의 채팅 메시지 조회
     */
    @Query("SELECT cm FROM ChatMessage cm " +
           "JOIN FETCH cm.user u " +
           "WHERE cm.isDeleted = false " +
           "ORDER BY cm.createdAt DESC " +
           "LIMIT :limit")
    List<ChatMessage> findRecentMessagesWithLimit(@Param("limit") int limit);

    /**
     * 특정 사용자의 메시지 개수 조회
     */
    @Query("SELECT COUNT(cm) FROM ChatMessage cm " +
           "WHERE cm.user.id = :userId " +
           "AND cm.isDeleted = false " +
           "AND cm.createdAt > :since")
    long countUserMessagesSince(@Param("userId") Long userId, @Param("since") LocalDateTime since);

    /**
     * 오래된 메시지 정리 (30일 이상)
     */
    @Query("UPDATE ChatMessage cm SET cm.isDeleted = true " +
           "WHERE cm.createdAt < :cutoffDate")
    int markOldMessagesAsDeleted(@Param("cutoffDate") LocalDateTime cutoffDate);
}