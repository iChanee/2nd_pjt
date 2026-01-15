package com.dfs.aqua.controller;

import com.dfs.aqua.entity.FishType;
import com.dfs.aqua.repository.FishTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fish-types")
public class FishTypeController {

    @Autowired
    private FishTypeRepository fishTypeRepository;

    /**
     * 모든 활성 물고기 타입 조회
     */
    @GetMapping
    public ResponseEntity<List<FishType>> getAllFishTypes() {
        List<FishType> fishTypes = fishTypeRepository.findByIsActiveTrueOrderByTypeCode();
        return ResponseEntity.ok(fishTypes);
    }

    /**
     * 특정 물고기 타입 조회
     */
    @GetMapping("/{typeCode}")
    public ResponseEntity<?> getFishType(@PathVariable String typeCode) {
        return fishTypeRepository.findById(typeCode)
                .map(fishType -> ResponseEntity.ok(fishType))
                .orElse(ResponseEntity.notFound().build());
    }
}