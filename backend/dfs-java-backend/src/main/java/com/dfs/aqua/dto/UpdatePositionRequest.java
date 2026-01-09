package com.dfs.aqua.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public class UpdatePositionRequest {
    
    @NotNull(message = "X 좌표는 필수입니다.")
    @DecimalMin(value = "0.0", message = "X 좌표는 0 이상이어야 합니다.")
    @DecimalMax(value = "100.0", message = "X 좌표는 100 이하여야 합니다.")
    private BigDecimal x;
    
    @NotNull(message = "Y 좌표는 필수입니다.")
    @DecimalMin(value = "0.0", message = "Y 좌표는 0 이상이어야 합니다.")
    @DecimalMax(value = "100.0", message = "Y 좌표는 100 이하여야 합니다.")
    private BigDecimal y;
    
    // 기본 생성자
    public UpdatePositionRequest() {}
    
    // 생성자
    public UpdatePositionRequest(BigDecimal x, BigDecimal y) {
        this.x = x;
        this.y = y;
    }
    
    // Getters and Setters
    public BigDecimal getX() {
        return x;
    }
    
    public void setX(BigDecimal x) {
        this.x = x;
    }
    
    public BigDecimal getY() {
        return y;
    }
    
    public void setY(BigDecimal y) {
        this.y = y;
    }
}