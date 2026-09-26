package com.abc.resume.resume.domain.entity.template;

import lombok.Data;

import java.util.List;

/**
 * 双列布局的左右栏模块归属
 *
 * @author LiJunXi
 * @date 2026/9/26
 */
@Data
public class ResumeTemplateColumn {
    /**
     * 左栏模块
     */
    private List<String> left;
    /**
     * 右栏模块
     */
    private List<String> right;
}
