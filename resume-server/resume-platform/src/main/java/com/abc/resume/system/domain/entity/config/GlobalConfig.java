package com.abc.resume.system.domain.entity.config;

import com.abc.resume.system.domain.entity.config.model.FeedbackSheet;
import lombok.Data;

/**
 * 全局配置
 *
 * @author LiJunXi
 * @date 2026/9/29
 */
@Data
public class GlobalConfig {

    /**
     * 问题反馈群入口
     */
    private FeedbackSheet feedbackSheet;

}
