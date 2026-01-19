package com.dfs.aqua.service;

import com.dfs.aqua.dto.*;
import com.dfs.aqua.entity.User;
import com.dfs.aqua.repository.UserRepository;
import com.dfs.aqua.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;

@Service
@Transactional
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    // 허용된 물고기 타입 목록 (프론트엔드와 동일)
    private static final List<String> VALID_FISH_TYPES = Arrays.asList(
        "goldfish", "tropical", "shark", "whale", "octopus", "crab",
        "seal", "pufferfish", "crocodile", "coral", "frog", "shell", 
        "jellyfish", "shrimp","otter","turtle"
    );

    /**
     * 회원가입
     */
    public AuthResponse register(RegisterRequest request) {
        // 이메일 중복 확인
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("이미 존재하는 이메일입니다.");
        }

        // 물고기 타입 유효성 확인
        if (!VALID_FISH_TYPES.contains(request.getFishType())) {
            throw new RuntimeException("유효하지 않은 물고기 타입입니다.");
        }

        // 비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(request.getPassword());

        // 사용자 생성
        User user = new User(
            request.getName(),
            request.getEmail(),
            encodedPassword,
            request.getFishType()
        );

        User savedUser = userRepository.save(user);

        // JWT 토큰 생성
        String token = jwtUtil.generateToken(savedUser.getEmail(), savedUser.getId());

        return new AuthResponse(token, UserResponse.from(savedUser));
    }

    /**
     * 로그인
     */
    public AuthResponse login(LoginRequest request) {
        // 사용자 찾기
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("가입되지 않은 이메일입니다. 회원가입을 먼저 진행해주세요."));

        // 비밀번호 확인
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("비밀번호가 일치하지 않습니다.");
        }

        // JWT 토큰 생성
        String token = jwtUtil.generateToken(user.getEmail(), user.getId());

        return new AuthResponse(token, UserResponse.from(user));
    }

    /**
     * 내 정보 조회
     */
    @Transactional(readOnly = true)
    public UserResponse getMyProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("존재하지 않는 사용자입니다."));

        return UserResponse.from(user);
    }

    /**
     * 내 정보 수정
     */
    public UserResponse updateProfile(Long userId, UpdateProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("존재하지 않는 사용자입니다."));

        // 이름 수정
        if (request.getName() != null && !request.getName().trim().isEmpty()) {
            user.setName(request.getName().trim());
        }

        // 물고기 타입 수정
        if (request.getFishType() != null && !request.getFishType().trim().isEmpty()) {
            if (!VALID_FISH_TYPES.contains(request.getFishType())) {
                throw new RuntimeException("유효하지 않은 물고기 타입입니다.");
            }
            user.setFishType(request.getFishType());
        }

        // 비밀번호 수정
        if (request.getPassword() != null && !request.getPassword().trim().isEmpty()) {
            String encodedPassword = passwordEncoder.encode(request.getPassword());
            user.setPasswordHash(encodedPassword);
        }

        User updatedUser = userRepository.save(user);
        return UserResponse.from(updatedUser);
    }

    /**
     * 토큰으로 사용자 정보 조회
     */
    @Transactional(readOnly = true)
    public UserResponse getUserFromToken(String token) {
        if (!jwtUtil.validateToken(token)) {
            throw new RuntimeException("유효하지 않은 토큰입니다.");
        }

        Long userId = jwtUtil.getUserIdFromToken(token);
        return getMyProfile(userId);
    }
}