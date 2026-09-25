package com.abc.resume.resume.domain.vo;

import com.abc.resume.resume.domain.entity.template.ResumeTemplateDetail;
import lombok.Data;

/**
 * 简历模板列表项
 *
 * <p>首页卡片要画封面，所以除了 code/name 之外还要带上封面与模板明细（含 layout / style）。</p>
 *
 * @author LiJunXi
 * @date 2026/9/25
 */
@Data
public class ResumeTemplateListVO {

    /** 模板编号 */
    private String code;

    /** 名称 */
    private String name;

    /** 封面 */
    private String cover;

    /** 模板明细 */
    private ResumeTemplateDetail templateDetail;
}
