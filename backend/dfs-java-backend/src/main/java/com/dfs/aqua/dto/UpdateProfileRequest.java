package com.dfs.aqua.dto;

import jakarta.validation.constraints.Size;

public class UpdateProfileRequest {
    
    @Size(max = 50, message = "이름은 50자를 초과할 수 없습니다")
    private String name;
    
    private String fishType;
    
    @Size(min = 6, message = "비밀번호는 최소 6자 이상이어야 합니다")
    private String password;
    
    // 기본 생성자
    public UpdateProfileRequest() {}
    
    // 생성자
    public UpdateProfileRequest(String name, String fishType, String password) {
        this.name = name;
        this.fishType = fishType;
        this.password = password;
    }
    
    // Getters and Setters
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getFishType() {
        return fishType;
    }
    
    public void setFishType(String fishType) {
        this.fishType = fishType;
    }
    
    public String getPassword() {
        return password;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
}