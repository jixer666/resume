package com.abc.resume.system.domain.entity.config;

import lombok.Data;

import java.util.HashMap;
import java.util.Map;

/**
 * 简历模块默认配置：模块默认数据 + 出厂默认全局样式 + 各模块默认样式。
 *
 * @author LiJunXi
 * @date 2026/9/26
 */
@Data
public class ResumeTemplateConfig {

    /**
     * 模块默认数据
     */
    private Map<String, Object> modelData = new HashMap<>();

    /**
     * 出厂默认全局样式，字段与 GlobalStyle 对齐
     */
    private Map<String, Object> globalStyle = new HashMap<>();

    /**
     * 模块默认样式，key 为模块名（如 WORK_EXPERIENCE）
     */
    private Map<String, Object> modelStyle = new HashMap<>();

}
