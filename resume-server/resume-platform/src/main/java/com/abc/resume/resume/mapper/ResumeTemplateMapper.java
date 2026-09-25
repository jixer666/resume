package com.abc.resume.resume.mapper;

import com.abc.resume.resume.domain.dto.ResumeTemplatePageDTO;
import com.abc.resume.resume.domain.entity.ResumeTemplate;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface ResumeTemplateMapper {

    List<ResumeTemplate> selectResumeTemplatePage(ResumeTemplatePageDTO dto);

}
