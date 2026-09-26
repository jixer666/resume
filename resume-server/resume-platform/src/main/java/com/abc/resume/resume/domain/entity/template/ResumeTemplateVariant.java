package com.abc.resume.resume.domain.entity.template;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

/**
 * 模块变体配置
 *
 * @author LiJunXi
 * @date 2026/9/26
 */
@Data
public class ResumeTemplateVariant {
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
     * 作品展示
     */
    @JsonProperty("WORKS_DISPLAY")
    private String worksDisplay;
    /**
     * 教育背景
     */
    @JsonProperty("EDU_BACKGROUND")
    private String eduBackground;
    /**
     * 自我评价
     */
    @JsonProperty("SELF_EVALUATION")
    private String selfEvaluation;
    /**
     * 工作经历
     */
    @JsonProperty("WORK_EXPERIENCE")
    private String workExperience;
    /**
     * 校园经历
     */
    @JsonProperty("CAMPUS_EXPERIENCE")
    private String campusExperience;
    /**
     * 技能特长
     */
    @JsonProperty("SKILL_SPECIALTIES")
    private String skillSpecialties;
    /**
     * 项目经历
     */
    @JsonProperty("PROJECT_EXPERIENCE")
    private String projectExperience;
    /**
     * 实习经历
     */
    @JsonProperty("INTERNSHIP_EXPERIENCE")
    private String internshipExperience;
}
