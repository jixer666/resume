package com.abc.resume.resume.service.impl;

import com.abc.resume.core.base.BaseService;
import com.abc.resume.core.page.PageResult;
import com.abc.resume.enums.ExceptionEnum;
import com.abc.resume.resume.domain.dto.ResumeTemplatePageDTO;
import com.abc.resume.resume.domain.entity.ResumeTemplate;
import com.abc.resume.resume.domain.vo.ResumeTemplateListVO;
import com.abc.resume.resume.domain.vo.ResumeTemplateVO;
import com.abc.resume.resume.mapper.ResumeTemplateMapper;
import com.abc.resume.resume.service.ResumeTemplateService;
import com.abc.resume.util.AssertUtils;
import com.abc.resume.util.BeanUtils;
import com.github.pagehelper.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ResumeTemplateServiceImpl extends BaseService implements ResumeTemplateService {

    @Autowired
    private ResumeTemplateMapper resumeTemplateMapper;

    @Override
    public PageResult getResumeTemplatePage(ResumeTemplatePageDTO dto) {
        startPage();
        List<ResumeTemplate> resumeTemplates = resumeTemplateMapper.selectResumeTemplatePage(dto);
        Page<ResumeTemplateListVO> page = pageList2CustomList(resumeTemplates,
                (list) -> BeanUtils.copyToList(list, ResumeTemplateListVO.class));
        return buildPageResult(page);
    }

    @Override
    public ResumeTemplateVO getTemplateDetail(String code) {
        AssertUtils.isNotEmpty(code, ExceptionEnum.PARAM_EXCEPTION);
        ResumeTemplate template = resumeTemplateMapper.selectResumeTemplateByCode(code);
        AssertUtils.isNotEmpty(template, ExceptionEnum.BIZ_EXCEPTION.getCode(), "模板不存在");
        return BeanUtils.copyProperties(template, ResumeTemplateVO.class);
    }

}
