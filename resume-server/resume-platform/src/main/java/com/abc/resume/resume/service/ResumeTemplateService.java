package com.abc.resume.resume.service;

import com.abc.resume.core.page.PageResult;
import com.abc.resume.resume.domain.dto.ResumeTemplatePageDTO;

/**
 * 简历模板服务
 */
public interface ResumeTemplateService {
    PageResult getResumeTemplatePage(ResumeTemplatePageDTO dto);
}
