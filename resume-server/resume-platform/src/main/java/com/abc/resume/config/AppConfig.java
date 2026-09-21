package com.abc.resume.config;

import com.abc.resume.core.config.annoation.ConfigAttribute;
import com.abc.resume.core.config.annoation.ConfigComponent;
import com.abc.resume.game.domain.entity.config.BreakthroughConfig;
import com.abc.resume.game.domain.entity.config.CultivationClaimConfig;
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

    /**
     * 修炼经验配置
     */
    @ConfigAttribute
    public CultivationClaimConfig cultivationClaimConfig;

    /**
     * 修炼突破配置
     */
    @ConfigAttribute
    public BreakthroughConfig breakthroughConfig;

}
