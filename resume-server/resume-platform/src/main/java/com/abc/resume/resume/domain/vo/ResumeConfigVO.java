package com.abc.resume.resume.domain.vo;

import lombok.Data;

import java.util.HashMap;
import java.util.Map;

/**
 * 简历前端配置：出厂默认全局样式 + 各模块默认样式。
 *
 * <p>前端启动时拉一次缓存，用于本地新建简历 / 新增模块时取样式，避免样式硬编码在前端。</p>
 *
 * @author LiJunXi
 * @date 2026/9/27
 */
@Data
public class ResumeConfigVO {

    /** 出厂默认全局样式，字段与 GlobalStyle 对齐 */
    private Map<String, Object> globalStyle = new HashMap<>();

    /** 模块默认样式，key 为模块名（如 WORK_EXPERIENCE） */
    private Map<String, Object> modelStyle = new HashMap<>();

}
