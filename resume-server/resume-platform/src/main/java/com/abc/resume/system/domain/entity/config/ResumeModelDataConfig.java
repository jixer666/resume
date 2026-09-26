package com.abc.resume.system.domain.entity.config;

import lombok.Data;

import java.util.HashMap;
import java.util.Map;

/**
 * 简历模块默认数据配置。
 *
 * @author LiJunXi
 * @date 2026/9/26
 */
@Data
public class ResumeModelDataConfig {

    /**
     * 模块默认数据
     */
    private Map<String, Object> modelData = new HashMap<>();

}
