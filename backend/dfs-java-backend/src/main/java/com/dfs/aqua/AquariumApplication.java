package com.dfs.aqua;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableScheduling;

import jakarta.annotation.PostConstruct;
import java.util.TimeZone;

@SpringBootApplication
@EnableJpaAuditing
@EnableScheduling
public class AquariumApplication extends SpringBootServletInitializer {

  @PostConstruct
  public void init() {
    // JVM 기본 타임존을 한국 시간으로 설정
    TimeZone.setDefault(TimeZone.getTimeZone("Asia/Seoul"));
  }

  @Override
  protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
    return application.sources(AquariumApplication.class);
  }
  
  public static void main(String[] args) {
        SpringApplication.run(AquariumApplication.class, args);
    }
}