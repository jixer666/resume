package com.abc.resume.resume.service;

import com.abc.resume.core.page.PageResult;
import com.abc.resume.resume.domain.dto.ResumeTemplatePageDTO;
import com.abc.resume.resume.domain.vo.ResumeTemplateVO;

/**
 * 简历模板服务
 */
public interface ResumeTemplateService {

    /**
     * 查询简历模板分页
     */
    PageResult getResumeTemplatePage(ResumeTemplatePageDTO dto);

    /**
     * 查询简历模板详情
     */
    ResumeTemplateVO getTemplateDetail(String code);
}
