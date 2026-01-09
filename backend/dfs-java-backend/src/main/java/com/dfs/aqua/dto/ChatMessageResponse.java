package com.dfs.aqua.dto;

import com.dfs.aqua.entity.ChatMessage;
import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDateTime;

public class ChatMessageResponse {
    private Long id;
    private Long userId;
    private String userName;
    private String userFishType;
    private String message;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;

    // 기본 생성자
    public ChatMessageResponse() {}

    // 생성자
    public ChatMessageResponse(Long id, Long userId, String userName, String userFishType, 
                              String message, LocalDateTime createdAt) {
        this.id = id;
        this.userId = userId;
        this.userName = userName;
        this.userFishType = userFishType;
        this.message = message;
        this.createdAt = createdAt;
    }

    // ChatMessage 엔티티로부터 생성
    public static ChatMessageResponse from(ChatMessage chatMessage) {
        return new ChatMessageResponse(
            chatMessage.getId(),
            chatMessage.getUser().getId(),
            chatMessage.getUser().getName(),
            chatMessage.getUser().getFishType(),
            chatMessage.getMessage(),
            chatMessage.getCreatedAt()
        );
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getUserFishType() {
        return userFishType;
    }

    public void setUserFishType(String userFishType) {
        this.userFishType = userFishType;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}