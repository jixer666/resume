package com.abc.resume.config;

import com.abc.resume.core.config.annoation.ConfigAttribute;
import com.abc.resume.core.config.annoation.ConfigComponent;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * 全局配置
 */
@Slf4j
@Getter
@Component
@ConfigComponent(value = "com.abc.resume.config.AppConfig")
public class AppConfig {



}
