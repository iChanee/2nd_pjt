package com.dfs.aqua.dto;

import com.dfs.aqua.entity.FishSession;
import com.fasterxml.jackson.annotation.JsonFormat;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class FishSessionResponse {
    
    private Long id;
    private String sessionToken;
    private BigDecimal positionX;
    private BigDecimal positionY;
    private Boolean isOnline;
    private UserResponse user;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime joinedAt;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime lastActivityAt;
    
    // 기본 생성자
    public FishSessionResponse() {}
    
    // 생성자
    public FishSessionResponse(Long id, String sessionToken, BigDecimal positionX, BigDecimal positionY,
                              Boolean isOnline, UserResponse user, LocalDateTime joinedAt, LocalDateTime lastActivityAt) {
        this.id = id;
        this.sessionToken = sessionToken;
        this.positionX = positionX;
        this.positionY = positionY;
        this.isOnline = isOnline;
        this.user = user;
        this.joinedAt = joinedAt;
        this.lastActivityAt = lastActivityAt;
    }
    
    // Entity에서 DTO로 변환하는 정적 메서드
    public static FishSessionResponse from(FishSession fishSession) {
        return new FishSessionResponse(
            fishSession.getId(),
            fishSession.getSessionToken(),
            fishSession.getPositionX(),
            fishSession.getPositionY(),
            fishSession.getIsOnline(),
            UserResponse.from(fishSession.getUser()),
            fishSession.getJoinedAt(),
            fishSession.getLastActivityAt()
        );
    }
    
    // 다른 사용자에게 보여줄 때 (세션 토큰 제외)
    public static FishSessionResponse fromForOthers(FishSession fishSession) {
        return new FishSessionResponse(
            fishSession.getId(),
            null, // 세션 토큰은 본인만 알 수 있음
            fishSession.getPositionX(),
            fishSession.getPositionY(),
            fishSession.getIsOnline(),
            UserResponse.from(fishSession.getUser()),
            fishSession.getJoinedAt(),
            fishSession.getLastActivityAt()
        );
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getSessionToken() {
        return sessionToken;
    }
    
    public void setSessionToken(String sessionToken) {
        this.sessionToken = sessionToken;
    }
    
    public BigDecimal getPositionX() {
        return positionX;
    }
    
    public void setPositionX(BigDecimal positionX) {
        this.positionX = positionX;
    }
    
    public BigDecimal getPositionY() {
        return positionY;
    }
    
    public void setPositionY(BigDecimal positionY) {
        this.positionY = positionY;
    }
    
    public Boolean getIsOnline() {
        return isOnline;
    }
    
    public void setIsOnline(Boolean isOnline) {
        this.isOnline = isOnline;
    }
    
    public UserResponse getUser() {
        return user;
    }
    
    public void setUser(UserResponse user) {
        this.user = user;
    }
    
    public LocalDateTime getJoinedAt() {
        return joinedAt;
    }
    
    public void setJoinedAt(LocalDateTime joinedAt) {
        this.joinedAt = joinedAt;
    }
    
    public LocalDateTime getLastActivityAt() {
        return lastActivityAt;
    }
    
    public void setLastActivityAt(LocalDateTime lastActivityAt) {
        this.lastActivityAt = lastActivityAt;
    }
}