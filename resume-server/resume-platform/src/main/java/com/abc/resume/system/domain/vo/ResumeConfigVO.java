package com.abc.resume.system.domain.vo;

import com.abc.resume.system.domain.entity.config.model.FeedbackSheet;
import lombok.Data;

import java.util.HashMap;
import java.util.Map;

/**
 * @author LiJunXi
 * @date 2026/9/27
 */
@Data
public class ResumeConfigVO {

    /**
     * 出厂默认全局样式
     */
    private Map<String, Object> globalStyle = new HashMap<>();

    /**
     * 模块默认样式
     */
    private Map<String, Object> modelStyle = new HashMap<>();

    /**
     * 问题反馈群入口
     */
    private FeedbackSheet feedbackSheet;

}
