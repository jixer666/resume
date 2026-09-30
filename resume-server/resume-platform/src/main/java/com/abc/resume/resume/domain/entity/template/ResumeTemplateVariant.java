package com.abc.resume.resume.domain.entity.template;

import com.abc.resume.util.StringUtils;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.google.common.collect.Lists;
import lombok.Data;

import java.lang.reflect.Field;
import java.lang.reflect.Modifier;
import java.util.List;

/**
 * 模块变体配置：模板里每个模块用哪一套皮肤。
 *
 * 字段声明顺序即模块的渲染顺序（与 ResumeModelEnum、前端 DEFAULT_MODELS 一致），
 * getValidFieldList 按声明顺序返回模板配了皮肤的模块 —— 新增模块必须给每个模板都配上
 * 皮肤，模板没配的模块不会进简历。
 *
 * @author LiJunXi
 * @date 2026/9/26
 */
@Data
public class ResumeTemplateVariant {
    /**
     * 基本信息
     */
    @JsonProperty("BASE_INFO")
    private String baseInfo;
    /**
     * 求职意向
     */
    @JsonProperty("JOB_INTENTION")
    private String jobIntention;
    /**
     * 教育背景
     */
    @JsonProperty("EDU_BACKGROUND")
    private String eduBackground;
    /**
     * 技能特长
     */
    @JsonProperty("SKILL_SPECIALTIES")
    private String skillSpecialties;
    /**
     * 校园经历
     */
    @JsonProperty("CAMPUS_EXPERIENCE")
    private String campusExperience;
    /**
     * 实习经历
     */
    @JsonProperty("INTERNSHIP_EXPERIENCE")
    private String internshipExperience;
    /**
     * 工作经历
     */
    @JsonProperty("WORK_EXPERIENCE")
    private String workExperience;
    /**
     * 项目经历
     */
    @JsonProperty("PROJECT_EXPERIENCE")
    private String projectExperience;
    /**
     * 获奖情况
     */
    @JsonProperty("AWARDS")
    private String awards;
    /**
     * 兴趣爱好
     */
    @JsonProperty("HOBBIES")
    private String hobbies;
    /**
     * 自我评价
     */
    @JsonProperty("SELF_EVALUATION")
    private String selfEvaluation;
    /**
     * 作品展示
     */
    @JsonProperty("WORKS_DISPLAY")
    private String worksDisplay;

    /**
     * 缓存字段，避免每次反射重复获取
     */
    private static final Field[] FIELDS;

    static {
        FIELDS = ResumeTemplateVariant.class.getDeclaredFields();
        for (Field field : FIELDS) {
            field.setAccessible(true);
        }
    }

    /**
     * 模板配了皮肤的模块名清单，顺序即渲染顺序
     */
    public List<String> getValidFieldList() {
        List<String> result = Lists.newArrayList();
        for (Field field : FIELDS) {
            // 跳过静态字段（比如 FIELDS 自身）
            if (Modifier.isStatic(field.getModifiers())) {
                continue;
            }
            try {
                Object value = field.get(this);
                if (!(value instanceof String)) {
                    continue;
                }
                if (StringUtils.isEmpty((String) value)) {
                    continue;
                }
                JsonProperty annotation = field.getAnnotation(JsonProperty.class);
                String name = (annotation != null && !annotation.value().isEmpty())
                        ? annotation.value()
                        : field.getName();
                result.add(name);
            } catch (IllegalAccessException e) {
                throw new RuntimeException("读取字段值失败: " + field.getName(), e);
            }
        }
        return result;
    }
}
