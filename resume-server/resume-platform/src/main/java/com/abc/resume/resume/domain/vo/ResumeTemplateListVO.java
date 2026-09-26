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

    /**
     * 模板明细（含 layout / style / variants）。
     *
     * <p>「使用模板」与预览页「更换模板」都只从列表取模板，列表不带明细就会套出一个空样式；
     * Mapper 的列表查询已经查了 template_detail 列，这里必须接住。</p>
     */
    private ResumeTemplateDetail templateDetail;

}
