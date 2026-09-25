package com.abc.resume.resume.domain.entity;

import com.abc.resume.core.base.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 简历
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class Resume extends BaseEntity {

    /** 归属用户uid */
    private String userId;

    /** 简历名称 */
    private String title;

    /** 整份简历JSON */
    private String resumeJson;

    /** 布局标识 */
    private String layout;

    /** 缩略图地址 */
    private String thumbnail;

}
