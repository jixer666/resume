package com.abc.resume.resume.domain.entity;

import com.abc.resume.core.base.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 简历模板
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class ResumeTemplate extends BaseEntity {

    /** 模板编号 */
    private String code;

    /** 名称 */
    private String name;

    /** 描述 */
    private String description;

    /** 封面 */
    private String cover;

    /** 分类 */
    private Integer category;

    /** 模板JSON */
    private String templateJson;

    /** 来源（1-官方预设 2-用户投稿） */
    private Integer source;

    /** 用户ID */
    private Long uid;

}
