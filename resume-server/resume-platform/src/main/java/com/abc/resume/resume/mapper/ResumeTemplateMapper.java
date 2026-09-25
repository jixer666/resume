package com.abc.resume.resume.mapper;

import com.abc.resume.resume.domain.dto.ResumeTemplatePageDTO;
import com.abc.resume.resume.domain.entity.ResumeTemplate;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ResumeTemplateMapper {

    List<ResumeTemplate> selectResumeTemplatePage(ResumeTemplatePageDTO dto);

    ResumeTemplate selectResumeTemplateByCode(@Param("code") String code);

}
