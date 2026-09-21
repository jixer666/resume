package com.abc.resume.core.config.model;

import lombok.Data;

/**
 * 职位体系配置
 * @author LiJunXi
 * @date 2026/8/16
 */
@Data
public class ProfessionItemConfig {

    private String code;

    private String name;

    private String desc;

    private ProfessionItemAttribute attribute;

    @Data
    public static class ProfessionItemAttribute {
        private Long hp;
        private Long atk;
        private Long def;
        private Long spd;
    }

}
