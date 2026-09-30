package com.abc.resume.system.domain.entity.config.model;

import lombok.Data;

/**
 * 问题反馈群入口配置：控制前端「问题反馈」入口是否展示、展示哪个 QQ 群号。
 *
 * @author LiJunXi
 * @date 2026/9/29
 */
@Data
public class FeedbackSheet {

    /**
     * 是否展示入口：只有显式配 false 才隐藏，配置缺失时前端按展示处理
     */
    private Boolean enabled;

    /**
     * 问题反馈 QQ 群号
     */
    private String qqGroupNumber;

}
