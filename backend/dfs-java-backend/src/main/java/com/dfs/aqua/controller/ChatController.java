package com.dfs.aqua.controller;

import com.dfs.aqua.dto.ChatMessageRequest;
import com.dfs.aqua.dto.ChatMessageResponse;
import com.dfs.aqua.entity.ChatMessage;
import com.dfs.aqua.service.ChatService;
import com.dfs.aqua.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @Autowired
    private JwtUtil jwtUtil;

    /**
     * 채팅 메시지 전송
     */
    @PostMapping("/send")
    public ResponseEntity<?> sendMessage(
            @Valid @RequestBody ChatMessageRequest request,
            HttpServletRequest httpRequest) {
        try {
            Long userId = getUserIdFromRequest(httpRequest);
            ChatMessage message = chatService.sendMessage(userId, request.getMessage());
            
            return ResponseEntity.ok(ChatMessageResponse.from(message));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * 최근 채팅 메시지 조회
     */
    @GetMapping("/messages")
    public ResponseEntity<?> getRecentMessages() {
        try {
            List<ChatMessage> messages = chatService.getRecentMessages();
            List<ChatMessageResponse> responses = messages.stream()
                    .map(ChatMessageResponse::from)
                    .collect(Collectors.<ChatMessageResponse>toList());
            
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * 특정 시간 이후의 새 메시지 조회 (폴링용)
     */
    @GetMapping("/messages/since")
    public ResponseEntity<?> getMessagesSince(@RequestParam String since) {
        try {
            LocalDateTime sinceDateTime = LocalDateTime.parse(since, DateTimeFormatter.ISO_LOCAL_DATE_TIME);
            List<ChatMessage> messages = chatService.getMessagesSince(sinceDateTime);
            List<ChatMessageResponse> responses = messages.stream()
                    .map(ChatMessageResponse::from)
                    .collect(Collectors.<ChatMessageResponse>toList());
            
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * 메시지 삭제
     */
    @DeleteMapping("/messages/{messageId}")
    public ResponseEntity<?> deleteMessage(
            @PathVariable Long messageId,
            HttpServletRequest httpRequest) {
        try {
            Long userId = getUserIdFromRequest(httpRequest);
            chatService.deleteMessage(messageId, userId);
            
            return ResponseEntity.ok(Map.of("message", "메시지가 삭제되었습니다."));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * JWT 토큰에서 사용자 ID 추출
     */
    private Long getUserIdFromRequest(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("인증 토큰이 필요합니다.");
        }
        
        String token = authHeader.substring(7);
        if (!jwtUtil.validateToken(token)) {
            throw new RuntimeException("유효하지 않은 토큰입니다.");
        }
        
        return jwtUtil.getUserIdFromToken(token);
    }
}