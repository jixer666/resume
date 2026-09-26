package com.abc.resume.config;

import com.abc.resume.constants.ConfigConstants;
import com.abc.resume.core.config.annoation.ConfigAttribute;
import com.abc.resume.core.config.annoation.ConfigComponent;
import com.abc.resume.system.domain.entity.config.ResumeModelDataConfig;
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

    @ConfigAttribute(ConfigConstants.RESUME_MODEL_DATA_CONFIG)
    private ResumeModelDataConfig resumeModelDataConfig;

}
