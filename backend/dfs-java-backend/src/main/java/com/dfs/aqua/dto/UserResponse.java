package com.dfs.aqua.dto;

import com.dfs.aqua.entity.User;
import java.time.LocalDateTime;

public class UserResponse {
    
    private Long id;
    private String name;
    private String email;
    private String fishType;
    private LocalDateTime createdAt;
    
    // 기본 생성자
    public UserResponse() {}
    
    // 생성자
    public UserResponse(Long id, String name, String email, String fishType, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.fishType = fishType;
        this.createdAt = createdAt;
    }
    
    // User 엔티티로부터 생성하는 정적 메서드
    public static UserResponse from(User user) {
        return new UserResponse(
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getFishType(),
            user.getCreatedAt()
        );
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getFishType() {
        return fishType;
    }
    
    public void setFishType(String fishType) {
        this.fishType = fishType;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}