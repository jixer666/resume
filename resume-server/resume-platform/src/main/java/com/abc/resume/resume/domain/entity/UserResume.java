package com.abc.resume.resume.domain.entity;

import com.abc.resume.core.base.BaseEntity;
import com.abc.resume.resume.domain.entity.resume.UserResumeDetail;
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

    /** 简历详情 */
    private UserResumeDetail resumeDetail;

    /** 缩略图地址，未生成时为空串 */
    private String thumbnail;

    /** 模板编码 */
    private String templateCode;

}
