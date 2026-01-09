package com.dfs.aqua.config;

import com.dfs.aqua.entity.FishType;
import com.dfs.aqua.repository.FishTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private FishTypeRepository fishTypeRepository;

    @Override
    public void run(String... args) throws Exception {
        // 물고기 타입 데이터가 없으면 초기 데이터 삽입
        if (fishTypeRepository.count() == 0) {
            initializeFishTypes();
        }
    }

    private void initializeFishTypes() {
        FishType[] fishTypes = {
            new FishType("goldfish", "금붕어", "Goldfish", "🐠", 
                        BigDecimal.valueOf(1.2), FishType.SizeCategory.medium),
            new FishType("tropical", "열대어", "Tropical Fish", "🐟", 
                        BigDecimal.valueOf(1.5), FishType.SizeCategory.small),
            new FishType("shark", "상어", "Shark", "🦈", 
                        BigDecimal.valueOf(1.0), FishType.SizeCategory.large),
            new FishType("whale", "고래", "Whale", "🐋", 
                        BigDecimal.valueOf(0.8), FishType.SizeCategory.xlarge),
            new FishType("octopus", "문어", "Octopus", "🐙", 
                        BigDecimal.valueOf(1.8), FishType.SizeCategory.medium),
            new FishType("crab", "게", "Crab", "🦀", 
                        BigDecimal.valueOf(3.0), FishType.SizeCategory.small),
            new FishType("seal", "물개", "Seal", "🦭", 
                        BigDecimal.valueOf(1.3), FishType.SizeCategory.large),
            new FishType("pufferfish", "복어", "Pufferfish", "🐡", 
                        BigDecimal.valueOf(0.9), FishType.SizeCategory.medium),
            new FishType("crocodile", "악어", "Crocodile", "🐊", 
                        BigDecimal.valueOf(0.7), FishType.SizeCategory.xlarge),
            new FishType("coral", "산호", "Coral", "🪸", 
                        BigDecimal.valueOf(0.3), FishType.SizeCategory.small),
            new FishType("frog", "개구리", "Frog", "🐸", 
                        BigDecimal.valueOf(1.1), FishType.SizeCategory.medium),
            new FishType("shell", "소라", "Shell", "🐚", 
                        BigDecimal.valueOf(0.4), FishType.SizeCategory.small)
        };

        for (FishType fishType : fishTypes) {
            fishTypeRepository.save(fishType);
        }

        System.out.println("물고기 타입 초기 데이터가 성공적으로 삽입되었습니다.");
    }
}