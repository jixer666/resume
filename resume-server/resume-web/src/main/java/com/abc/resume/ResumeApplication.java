package com.abc.resume;

import lombok.extern.slf4j.Slf4j;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@Slf4j
@EnableScheduling
@SpringBootApplication(scanBasePackages = "com.abc.resume.*")
@MapperScan({"com.abc.resume.*.mapper"})
public class ResumeApplication {
    public static void main(String[] args) {
        SpringApplication.run(ResumeApplication.class, args);
        log.info("服务启动成功");
    }
}
