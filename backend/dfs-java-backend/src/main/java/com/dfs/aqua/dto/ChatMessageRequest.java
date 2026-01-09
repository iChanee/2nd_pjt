package com.dfs.aqua.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ChatMessageRequest {
    @NotBlank(message = "메시지는 비어있을 수 없습니다.")
    @Size(max = 500, message = "메시지는 500자를 초과할 수 없습니다.")
    private String message;

    // 기본 생성자
    public ChatMessageRequest() {}

    // 생성자
    public ChatMessageRequest(String message) {
        this.message = message;
    }

    // Getters and Setters
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}