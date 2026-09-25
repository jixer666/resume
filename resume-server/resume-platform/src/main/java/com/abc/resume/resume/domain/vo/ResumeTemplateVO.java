package com.abc.resume.resume.domain.vo;

import com.abc.resume.resume.domain.entity.template.ResumeTemplateDetail;
import lombok.Data;

@Data
public class ResumeTemplateVO {

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

    /** 来源（1-官方预设 2-用户投稿） */
    private Integer source;

    /** 用户ID */
    private Long uid;

    /** 模板明细 */
    private ResumeTemplateDetail templateDetail;
}
