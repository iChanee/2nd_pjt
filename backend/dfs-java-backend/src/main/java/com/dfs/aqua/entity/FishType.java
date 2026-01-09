package com.dfs.aqua.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "fish_types")
public class FishType {
    
    @Id
    @Column(name = "type_code", length = 20)
    private String typeCode;
    
    @Column(name = "name_ko", nullable = false, length = 20)
    private String nameKo;
    
    @Column(name = "name_en", nullable = false, length = 20)
    private String nameEn;
    
    @Column(nullable = false, length = 10)
    private String emoji;
    
    @Column(nullable = false, precision = 3, scale = 1)
    private BigDecimal speed;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "size_category", nullable = false)
    private SizeCategory sizeCategory;
    
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;
    
    // Enum for size categories
    public enum SizeCategory {
        small, medium, large, xlarge
    }
    
    // 기본 생성자
    public FishType() {}
    
    // 생성자
    public FishType(String typeCode, String nameKo, String nameEn, String emoji, 
                   BigDecimal speed, SizeCategory sizeCategory) {
        this.typeCode = typeCode;
        this.nameKo = nameKo;
        this.nameEn = nameEn;
        this.emoji = emoji;
        this.speed = speed;
        this.sizeCategory = sizeCategory;
    }
    
    // Getters and Setters
    public String getTypeCode() {
        return typeCode;
    }
    
    public void setTypeCode(String typeCode) {
        this.typeCode = typeCode;
    }
    
    public String getNameKo() {
        return nameKo;
    }
    
    public void setNameKo(String nameKo) {
        this.nameKo = nameKo;
    }
    
    public String getNameEn() {
        return nameEn;
    }
    
    public void setNameEn(String nameEn) {
        this.nameEn = nameEn;
    }
    
    public String getEmoji() {
        return emoji;
    }
    
    public void setEmoji(String emoji) {
        this.emoji = emoji;
    }
    
    public BigDecimal getSpeed() {
        return speed;
    }
    
    public void setSpeed(BigDecimal speed) {
        this.speed = speed;
    }
    
    public SizeCategory getSizeCategory() {
        return sizeCategory;
    }
    
    public void setSizeCategory(SizeCategory sizeCategory) {
        this.sizeCategory = sizeCategory;
    }
    
    public Boolean getIsActive() {
        return isActive;
    }
    
    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }
}