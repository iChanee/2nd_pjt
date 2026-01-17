package com.dfs.aqua.service;

import com.dfs.aqua.entity.ChatMessage;
import com.dfs.aqua.entity.User;
import com.dfs.aqua.repository.ChatMessageRepository;
import com.dfs.aqua.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class ChatService {

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * 채팅 메시지 전송
     */
    public ChatMessage sendMessage(Long userId, String message) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("존재하지 않는 사용자입니다."));

        // 스팸 방지: 최근 10초 내에 5개 이상 메시지 전송 시 제한
        LocalDateTime tenSecondsAgo = LocalDateTime.now().minusSeconds(10);
        long recentMessageCount = chatMessageRepository.countUserMessagesSince(userId, tenSecondsAgo);
        
        if (recentMessageCount >= 5) {
            throw new RuntimeException("메시지를 너무 빠르게 전송하고 있습니다. 잠시 후 다시 시도해주세요.");
        }

        // 메시지 길이 검증
        if (message == null || message.trim().isEmpty()) {
            throw new RuntimeException("메시지는 비어있을 수 없습니다.");
        }

        if (message.length() > 500) {
            throw new RuntimeException("메시지는 500자를 초과할 수 없습니다.");
        }

        // 채팅 메시지 생성 및 저장
        ChatMessage chatMessage = new ChatMessage(user, message.trim());
        return chatMessageRepository.save(chatMessage);
    }

    /**
     * 최근 채팅 메시지 조회 (최대 50개)
     */
    @Transactional(readOnly = true)
    public List<ChatMessage> getRecentMessages() {
        return chatMessageRepository.findRecentMessagesWithLimit(50);
    }

    /**
     * 특정 시간 이후의 새 메시지 조회
     */
    @Transactional(readOnly = true)
    public List<ChatMessage> getMessagesSince(LocalDateTime since) {
        return chatMessageRepository.findMessagesSince(since);
    }

    /**
     * 메시지 삭제 (소프트 삭제)
     */
    public void deleteMessage(Long messageId, Long userId) {
        ChatMessage message = chatMessageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("존재하지 않는 메시지입니다."));

        // 본인 메시지만 삭제 가능
        if (!message.getUser().getId().equals(userId)) {
            throw new RuntimeException("본인의 메시지만 삭제할 수 있습니다.");
        }

        message.delete();
        chatMessageRepository.save(message);
    }

    /**
     * 5분 이상된 모든 채팅 메시지 삭제
     */
    public int deleteMessagesOlderThan5Minutes() {
        LocalDateTime fiveMinutesAgo = LocalDateTime.now().minusMinutes(5);
        return chatMessageRepository.deleteByCreatedAtBefore(fiveMinutesAgo);
    }

    /**
     * 오래된 메시지 정리 (30일 이상)
     */
    public int cleanupOldMessages() {
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        return chatMessageRepository.markOldMessagesAsDeleted(thirtyDaysAgo);
    }
}