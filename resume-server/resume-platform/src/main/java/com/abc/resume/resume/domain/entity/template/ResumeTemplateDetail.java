package com.abc.resume.resume.domain.entity.template;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
public class ResumeTemplateDetail {

    private Style style;
    private List<String> hidden;
    private String layout;
    private Variants variants;
    /** 双列布局下模块的左右栏归属 */
    private Columns columns;

    /**
     * 样式配置
     */
    @Data
    public static class Style {
        /** 上边距 */
        private String pTop;
        /** 下边距 */
        private String pBottom;
        /** 左右边距（左右布局） */
        private String pLeftRight;
        /** 主题色 */
        private String themeColor;
        /** 正文字体大小 */
        private String textFontSize;
        /** 正文字体颜色 */
        private String textFontColor;
        /** 模块上边距 */
        private String modelMarginTop;
        /** 正文字体粗细 */
        private Integer textFontWeight;
        /** 二级标题颜色 */
        private String secondTitleColor;
        /** 模块下边距 */
        private String modelMarginBottom;
        /** 二级标题粗细 */
        private Integer secondTitleWeight;
        /** 一级标题字体大小 */
        private String firstTitleFontSize;
        /** 二级标题字体大小 */
        private String secondTitleFontSize;
        /** 左右布局时左侧宽度 */
        private String leftWidth;
        /** 左右布局时右侧宽度 */
        private String rightWidth;
        /** 左右布局时左侧背景色 */
        private String leftThemeColor;
        /** 左右布局时右侧背景色 */
        private String rightThemeColor;
    }

    /**
     * 模块变体配置
     */
    @Data
    public static class Variants {
        /** 获奖情况 */
        @JsonProperty("AWARDS")
        private String awards;
        /** 兴趣爱好 */
        @JsonProperty("HOBBIES")
        private String hobbies;
        /** 基本信息 */
        @JsonProperty("BASE_INFO")
        private String baseInfo;
        /** 求职意向 */
        @JsonProperty("JOB_INTENTION")
        private String jobIntention;
        /** 作品展示 */
        @JsonProperty("WORKS_DISPLAY")
        private String worksDisplay;
        /** 教育背景 */
        @JsonProperty("EDU_BACKGROUND")
        private String eduBackground;
        /** 自我评价 */
        @JsonProperty("SELF_EVALUATION")
        private String selfEvaluation;
        /** 工作经历 */
        @JsonProperty("WORK_EXPERIENCE")
        private String workExperience;
        /** 校园经历 */
        @JsonProperty("CAMPUS_EXPERIENCE")
        private String campusExperience;
        /** 技能特长 */
        @JsonProperty("SKILL_SPECIALTIES")
        private String skillSpecialties;
        /** 项目经历 */
        @JsonProperty("PROJECT_EXPERIENCE")
        private String projectExperience;
        /** 实习经历 */
        @JsonProperty("INTERNSHIP_EXPERIENCE")
        private String internshipExperience;
    }

    /**
     * 双列布局的左右栏模块归属
     */
    @Data
    public static class Columns {
        /** 左栏模块 */
        private List<String> left;
        /** 右栏模块 */
        private List<String> right;
    }

}
