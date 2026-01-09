package com.dfs.aqua.controller;

import com.dfs.aqua.dto.*;
import com.dfs.aqua.service.AuthService;
import com.dfs.aqua.service.FishSessionService;
import com.dfs.aqua.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private FishSessionService fishSessionService;

    /**
     * 회원가입
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            AuthResponse response = authService.register(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    /**
     * 로그인
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    /**
     * 내 정보 조회
     */
    @GetMapping("/me")
    public ResponseEntity<?> getMyProfile(HttpServletRequest request) {
        try {
            String token = extractTokenFromRequest(request);
            if (token == null) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "토큰이 필요합니다.");
                return ResponseEntity.badRequest().body(error);
            }

            UserResponse response = authService.getUserFromToken(token);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    /**
     * 내 정보 수정
     */
    @PutMapping("/me")
    public ResponseEntity<?> updateProfile(@Valid @RequestBody UpdateProfileRequest request, 
                                         HttpServletRequest httpRequest) {
        try {
            String token = extractTokenFromRequest(httpRequest);
            if (token == null) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "토큰이 필요합니다.");
                return ResponseEntity.badRequest().body(error);
            }

            if (!jwtUtil.validateToken(token)) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "유효하지 않은 토큰입니다.");
                return ResponseEntity.badRequest().body(error);
            }

            Long userId = jwtUtil.getUserIdFromToken(token);
            UserResponse response = authService.updateProfile(userId, request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    /**
     * 토큰 유효성 검사
     */
    @PostMapping("/validate")
    public ResponseEntity<?> validateToken(HttpServletRequest request) {
        try {
            String token = extractTokenFromRequest(request);
            if (token == null) {
                Map<String, Object> response = new HashMap<>();
                response.put("valid", false);
                response.put("message", "토큰이 없습니다.");
                return ResponseEntity.ok(response);
            }

            boolean isValid = jwtUtil.validateToken(token) && !jwtUtil.isTokenExpired(token);
            Map<String, Object> response = new HashMap<>();
            response.put("valid", isValid);
            
            if (isValid) {
                UserResponse user = authService.getUserFromToken(token);
                response.put("user", user);
            }
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("valid", false);
            response.put("message", e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    /**
     * 로그아웃 - is_online을 0으로 변경
     */
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        System.out.println("=== AuthController.logout 호출됨 ===");
        
        try {
            // JWT 토큰에서 사용자 ID 추출
            String authHeader = request.getHeader("Authorization");
            System.out.println("Authorization 헤더: " + authHeader);
            
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                System.out.println("토큰 추출됨");
                
                if (jwtUtil.validateToken(token)) {
                    Long userId = jwtUtil.getUserIdFromToken(token);
                    System.out.println("사용자 ID: " + userId);
                    
                    // 사용자 세션을 완전히 삭제 (DB에서 제거)
                    System.out.println("deleteUserSessions 호출 시작");
                    fishSessionService.deleteUserSessions(userId);
                    System.out.println("deleteUserSessions 호출 완료");
                } else {
                    System.out.println("토큰이 유효하지 않음");
                }
            } else {
                System.out.println("Authorization 헤더가 없음");
            }
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "로그아웃되었습니다.");
            System.out.println("=== AuthController.logout 완료 ===");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("로그아웃 에러: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "로그아웃되었습니다.");
            return ResponseEntity.ok(response);
        }
    }

    /**
     * 요청에서 JWT 토큰 추출
     */
    private String extractTokenFromRequest(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        return null;
    }
}