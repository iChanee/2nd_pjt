package com.dfs.aqua.repository;

import com.dfs.aqua.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    /**
     * 이메일로 사용자 찾기
     */
    Optional<User> findByEmail(String email);
    
    /**
     * 이메일 존재 여부 확인
     */
    boolean existsByEmail(String email);
    
    /**
     * 물고기 타입으로 사용자 수 조회
     */
    @Query("SELECT COUNT(u) FROM User u WHERE u.fishType = :fishType")
    long countByFishType(@Param("fishType") String fishType);
    
    /**
     * 이메일과 이름으로 사용자 찾기 (비밀번호 찾기용)
     */
    Optional<User> findByEmailAndName(String email, String name);
}