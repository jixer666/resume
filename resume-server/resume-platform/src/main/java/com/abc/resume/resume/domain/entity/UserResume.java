package com.abc.resume.resume.domain.entity;

import com.abc.resume.core.base.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 用户简历
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class UserResume extends BaseEntity {

    /** 用户ID */
    private String uid;

    /** 简历名称 */
    private String title;

    /** 布局 */
    private String layout;

    /** 简历JSON */
    private String resumeJson;

    /** 缩略图地址，未生成时为空串 */
    private String thumbnail;

    /** 模板编码 */
    private String templateCode;

}
