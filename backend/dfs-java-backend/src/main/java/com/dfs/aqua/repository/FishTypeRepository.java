package com.dfs.aqua.repository;

import com.dfs.aqua.entity.FishType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FishTypeRepository extends JpaRepository<FishType, String> {
    
    /**
     * 활성화된 물고기 타입들만 조회
     */
    List<FishType> findByIsActiveTrueOrderByTypeCode();
    
    /**
     * 크기별 물고기 타입 조회
     */
    List<FishType> findBySizeCategoryAndIsActiveTrueOrderBySpeed(FishType.SizeCategory sizeCategory);
    
    /**
     * 모든 활성 물고기 타입을 속도순으로 조회
     */
    @Query("SELECT ft FROM FishType ft WHERE ft.isActive = true ORDER BY ft.speed DESC")
    List<FishType> findAllActiveOrderBySpeedDesc();
}