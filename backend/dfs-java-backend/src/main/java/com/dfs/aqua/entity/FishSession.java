package com.dfs.aqua.entity;

import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "fish_sessions")
@EntityListeners(AuditingEntityListener.class)
public class FishSession {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(name = "session_token", unique = true, nullable = false)
    private String sessionToken;
    
    @Column(name = "position_x", precision = 5, scale = 2)
    private BigDecimal positionX = BigDecimal.valueOf(50.00);
    
    @Column(name = "position_y", precision = 5, scale = 2)
    private BigDecimal positionY = BigDecimal.valueOf(50.00);
    
    @Column(name = "is_online", nullable = false)
    private Boolean isOnline = true;
    
    @CreatedDate
    @Column(name = "joined_at", nullable = false, updatable = false)
    private LocalDateTime joinedAt;
    
    @LastModifiedDate
    @Column(name = "last_activity_at")
    private LocalDateTime lastActivityAt;
    
    // 기본 생성자
    public FishSession() {}
    
    // 생성자
    public FishSession(User user, String sessionToken) {
        this.user = user;
        this.sessionToken = sessionToken;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
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
    
    // 편의 메서드
    public void updatePosition(BigDecimal x, BigDecimal y) {
        this.positionX = x;
        this.positionY = y;
    }
    
    public void goOffline() {
        this.isOnline = false;
    }
    
    public void goOnline() {
        this.isOnline = true;
    }
}