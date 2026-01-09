package com.dfs.aqua.controller;

import com.dfs.aqua.entity.FishType;
import com.dfs.aqua.repository.FishTypeRepository;
import com.dfs.aqua.repository.UserRepository;
import com.dfs.aqua.repository.FishSessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/test")
public class TestController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FishSessionRepository fishSessionRepository;

    @Autowired
    private FishTypeRepository fishTypeRepository;

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "OK");
        response.put("message", "어항 서비스 백엔드가 정상적으로 실행 중입니다!");
        response.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/db-status")
    public ResponseEntity<Map<String, Object>> databaseStatus() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            long userCount = userRepository.count();
            long sessionCount = fishSessionRepository.count();
            long onlineCount = fishSessionRepository.countByIsOnlineTrue();
            long fishTypeCount = fishTypeRepository.count();
            
            response.put("status", "Connected");
            response.put("userCount", userCount);
            response.put("sessionCount", sessionCount);
            response.put("onlineCount", onlineCount);
            response.put("fishTypeCount", fishTypeCount);
            
        } catch (Exception e) {
            response.put("status", "Error");
            response.put("error", e.getMessage());
        }
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/fish-types")
    public ResponseEntity<List<FishType>> getFishTypes() {
        List<FishType> fishTypes = fishTypeRepository.findByIsActiveTrueOrderByTypeCode();
        return ResponseEntity.ok(fishTypes);
    }
}