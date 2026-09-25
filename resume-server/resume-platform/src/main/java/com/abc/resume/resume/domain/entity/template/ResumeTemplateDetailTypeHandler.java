package com.abc.resume.resume.domain.entity.template;

import com.abc.resume.core.mybatis.handler.JsonTypeHandler;
import org.apache.ibatis.type.MappedTypes;

/**
 * 简历模板字段TypeHandler
 */
@MappedTypes(ResumeTemplateDetail.class)
public class ResumeTemplateDetailTypeHandler extends JsonTypeHandler<ResumeTemplateDetail> {

    public ResumeTemplateDetailTypeHandler() {
        super(ResumeTemplateDetail.class);
    }

}
