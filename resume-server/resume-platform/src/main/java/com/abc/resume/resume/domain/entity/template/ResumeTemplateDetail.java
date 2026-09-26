package com.abc.resume.resume.domain.entity.template;

import lombok.Data;

import java.util.List;

@Data
public class ResumeTemplateDetail {

    private ResumeTemplateStyle style;

    private List<String> hidden;

    private String layout;

    private ResumeTemplateVariant variants;

    /**
     * 双列布局下模块的左右栏归属
     */
    private ResumeTemplateColumn columns;

}
