package com.dfs.aqua.controller;

import com.dfs.aqua.dto.FishSessionResponse;
import com.dfs.aqua.dto.UpdatePositionRequest;
import com.dfs.aqua.entity.FishSession;
import com.dfs.aqua.service.FishSessionService;
import com.dfs.aqua.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/aquarium")
@CrossOrigin(origins = "http://localhost:3000")
public class AquariumController {

    @Autowired
    private FishSessionService fishSessionService;

    @Autowired
    private JwtUtil jwtUtil;

    /**
     * 어항 입장 (세션 생성)
     */
    @PostMapping("/join")
    public ResponseEntity<?> joinAquarium(HttpServletRequest request) {
        try {
            Long userId = getUserIdFromRequest(request);
            FishSession session = fishSessionService.joinAquarium(userId);
            
            return ResponseEntity.ok(FishSessionResponse.from(session));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * 어항 퇴장
     */
    @PostMapping("/leave")
    public ResponseEntity<?> leaveAquarium(HttpServletRequest request) {
        try {
            Long userId = getUserIdFromRequest(request);
            fishSessionService.leaveAquarium(userId);
            
            return ResponseEntity.ok(Map.of("message", "어항에서 퇴장했습니다."));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * 세션 완전 삭제 (로그아웃 시 사용)
     */
    @DeleteMapping("/session")
    public ResponseEntity<?> deleteSession(HttpServletRequest request) {
        try {
            Long userId = getUserIdFromRequest(request);
            fishSessionService.deleteUserSessions(userId);
            
            return ResponseEntity.ok(Map.of("message", "세션이 삭제되었습니다."));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * 브라우저 종료 시 세션 정리 (sendBeacon용)
     */
    @PostMapping("/cleanup")
    public ResponseEntity<?> cleanupSession(HttpServletRequest request) {
        try {
            Long userId = getUserIdFromRequest(request);
            fishSessionService.deleteUserSessions(userId);
            
            return ResponseEntity.ok(Map.of("message", "세션이 정리되었습니다."));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * 내 세션 정보 조회
     */
    @GetMapping("/my-session")
    public ResponseEntity<?> getMySession(HttpServletRequest request) {
        try {
            Long userId = getUserIdFromRequest(request);
            Optional<FishSession> session = fishSessionService.getActiveSession(userId);
            
            if (session.isPresent()) {
                return ResponseEntity.ok(FishSessionResponse.from(session.get()));
            } else {
                return ResponseEntity.ok(Map.of("message", "활성 세션이 없습니다."));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * 모든 온라인 물고기 조회
     */
    @GetMapping("/fishes")
    public ResponseEntity<?> getAllOnlineFishes() {
        try {
            List<FishSession> sessions = fishSessionService.getAllOnlineSessions();
            List<FishSessionResponse> responses = sessions.stream()
                    .map(FishSessionResponse::fromForOthers) // 다른 사용자용 (세션 토큰 제외)
                    .collect(Collectors.toList());
            
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * 물고기 위치 업데이트
     */
    @PutMapping("/position")
    public ResponseEntity<?> updatePosition(
            @Valid @RequestBody UpdatePositionRequest request,
            HttpServletRequest httpRequest) {
        try {
            Long userId = getUserIdFromRequest(httpRequest);
            Optional<FishSession> sessionOpt = fishSessionService.getActiveSession(userId);
            
            if (sessionOpt.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "활성 세션이 없습니다. 먼저 어항에 입장해주세요."));
            }
            
            FishSession session = sessionOpt.get();
            FishSession updatedSession = fishSessionService.updatePosition(
                    session.getSessionToken(), request.getX(), request.getY());
            
            return ResponseEntity.ok(FishSessionResponse.from(updatedSession));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * 활동 업데이트 (하트비트)
     */
    @PostMapping("/heartbeat")
    public ResponseEntity<?> heartbeat(HttpServletRequest request) {
        try {
            Long userId = getUserIdFromRequest(request);
            Optional<FishSession> sessionOpt = fishSessionService.getActiveSession(userId);
            
            if (sessionOpt.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "활성 세션이 없습니다."));
            }
            
            fishSessionService.updateActivity(sessionOpt.get().getSessionToken());
            return ResponseEntity.ok(Map.of("message", "활동 시간이 업데이트되었습니다."));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * 어항 상태 조회 (온라인 사용자 수 등)
     */
    @GetMapping("/status")
    public ResponseEntity<?> getAquariumStatus() {
        try {
            long onlineCount = fishSessionService.getOnlineUserCount();
            
            Map<String, Object> status = new HashMap<>();
            status.put("onlineUserCount", onlineCount);
            status.put("message", onlineCount > 0 ? 
                    onlineCount + "마리의 물고기가 헤엄치고 있습니다 🐠" : 
                    "어항이 비어있습니다. 첫 번째 물고기가 되어보세요! 🌊");
            
            return ResponseEntity.ok(status);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * JWT 토큰에서 사용자 ID 추출
     */
    private Long getUserIdFromRequest(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("인증 토큰이 필요합니다.");
        }
        
        String token = authHeader.substring(7);
        if (!jwtUtil.validateToken(token)) {
            throw new RuntimeException("유효하지 않은 토큰입니다.");
        }
        
        return jwtUtil.getUserIdFromToken(token);
    }
}