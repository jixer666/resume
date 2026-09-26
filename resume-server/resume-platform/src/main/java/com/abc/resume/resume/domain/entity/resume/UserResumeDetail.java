package com.abc.resume.resume.domain.entity.resume;

import com.abc.resume.resume.domain.entity.ResumeTemplate;
import com.abc.resume.resume.domain.entity.template.ResumeTemplateDetail;
import com.abc.resume.system.domain.entity.config.ResumeModelDataConfig;
import com.abc.resume.util.IdUtils;
import com.abc.resume.util.JsonUtils;
import com.abc.resume.util.StringUtils;
import com.alibaba.fastjson2.JSON;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

/**
 * 用户简历详情
 */
@Data
public class UserResumeDetail {

    /**
     * 默认铺的模块，顺序即渲染顺序（CUSTOM_* 属可选模块，不进默认组合）
     */
    private static final List<String> DEFAULT_MODELS = Arrays.asList(
            "RESUME_TITLE", "BASE_INFO", "JOB_INTENTION", "EDU_BACKGROUND",
            "SKILL_SPECIALTIES", "CAMPUS_EXPERIENCE", "INTERNSHIP_EXPERIENCE",
            "WORK_EXPERIENCE", "PROJECT_EXPERIENCE", "AWARDS", "HOBBIES",
            "SELF_EVALUATION", "WORKS_DISPLAY");
    /**
     * 双列布局标识
     */
    private static final String LAYOUT_LEFT_RIGHT = "leftRight";
    /**
     * 简历默认名称
     */
    private static final String DEFAULT_RESUME_NAME = "未命名简历";

    /**
     * 简历名称
     */
    @JsonProperty("NAME")
    private String name;

    /**
     * 简历标题
     */
    @JsonProperty("TITLE")
    private String title;

    /**
     * 布局：leftRight 双列，其余单列
     */
    @JsonProperty("LAYOUT")
    private String layout;

    /**
     * 模块列表
     */
    @JsonProperty("COMPONENTS")
    private List<ResumeComponent> components;

    /**
     * 全局样式
     */
    @JsonProperty("GLOBAL_STYLE")
    private GlobalStyle globalStyle;

    /**
     * 按模板构造一份简历骨架，模块 data 的默认值取自配置中心的模块默认数据
     */
    public static UserResumeDetail fromTemplate(ResumeTemplate template, ResumeModelDataConfig modelDataConfig) {
        UserResumeDetail detail = new UserResumeDetail();
        detail.setName(DEFAULT_RESUME_NAME);
        detail.setGlobalStyle(buildDefaultGlobalStyle());
        if (Objects.isNull(template)) {
            return detail;
        }
        ResumeTemplateDetail templateDetail = template.getTemplateDetail();
        detail.setLayout(templateDetail.getLayout());
        applyStyle(detail.getGlobalStyle(), templateDetail.getStyle());
        List<ResumeComponent> components = DEFAULT_MODELS.stream()
                .map(item -> buildResumeComponent(item, templateDetail, modelDataConfig)).collect(Collectors.toList());
        detail.setComponents(components);
        return detail;
    }

    /**
     * 出厂默认全局样式
     */
    private static GlobalStyle buildDefaultGlobalStyle() {
        GlobalStyle style = new GlobalStyle();
        style.setThemeColor("#079cfa");
        style.setFirstTitleFontSize("20px");
        style.setSecondTitleFontSize("14px");
        style.setTextFontSize("14px");
        style.setSecondTitleColor("#666");
        style.setTextFontColor("#757575");
        style.setSecondTitleWeight(600);
        style.setTextFontWeight(500);
        style.setPTop("0px");
        style.setPBottom("0px");
        style.setPLeftRight(StringUtils.EMPTY);
        style.setModelMarginTop("0px");
        style.setModelMarginBottom("45px");
        style.setLeftWidth(StringUtils.EMPTY);
        style.setRightWidth(StringUtils.EMPTY);
        style.setLeftThemeColor(StringUtils.EMPTY);
        style.setRightThemeColor(StringUtils.EMPTY);
        return style;
    }

    /**
     * 把模板样式里非空字段覆盖到全局样式上
     */
    private static void applyStyle(GlobalStyle target, ResumeTemplateDetail.Style source) {
        if (target == null || source == null) {
            return;
        }
        if (StringUtils.isNotBlank(source.getThemeColor())) {
            target.setThemeColor(source.getThemeColor());
        }
        if (StringUtils.isNotBlank(source.getFirstTitleFontSize())) {
            target.setFirstTitleFontSize(source.getFirstTitleFontSize());
        }
        if (StringUtils.isNotBlank(source.getSecondTitleFontSize())) {
            target.setSecondTitleFontSize(source.getSecondTitleFontSize());
        }
        if (StringUtils.isNotBlank(source.getTextFontSize())) {
            target.setTextFontSize(source.getTextFontSize());
        }
        if (StringUtils.isNotBlank(source.getSecondTitleColor())) {
            target.setSecondTitleColor(source.getSecondTitleColor());
        }
        if (StringUtils.isNotBlank(source.getTextFontColor())) {
            target.setTextFontColor(source.getTextFontColor());
        }
        if (source.getSecondTitleWeight() != null) {
            target.setSecondTitleWeight(source.getSecondTitleWeight());
        }
        if (source.getTextFontWeight() != null) {
            target.setTextFontWeight(source.getTextFontWeight());
        }
        if (StringUtils.isNotBlank(source.getPTop())) {
            target.setPTop(source.getPTop());
        }
        if (StringUtils.isNotBlank(source.getPBottom())) {
            target.setPBottom(source.getPBottom());
        }
        if (StringUtils.isNotBlank(source.getPLeftRight())) {
            target.setPLeftRight(source.getPLeftRight());
        }
        if (StringUtils.isNotBlank(source.getModelMarginTop())) {
            target.setModelMarginTop(source.getModelMarginTop());
        }
        if (StringUtils.isNotBlank(source.getModelMarginBottom())) {
            target.setModelMarginBottom(source.getModelMarginBottom());
        }
        if (StringUtils.isNotBlank(source.getLeftWidth())) {
            target.setLeftWidth(source.getLeftWidth());
        }
        if (StringUtils.isNotBlank(source.getRightWidth())) {
            target.setRightWidth(source.getRightWidth());
        }
        if (StringUtils.isNotBlank(source.getLeftThemeColor())) {
            target.setLeftThemeColor(source.getLeftThemeColor());
        }
        if (StringUtils.isNotBlank(source.getRightThemeColor())) {
            target.setRightThemeColor(source.getRightThemeColor());
        }
    }

    /**
     * 构造单个模块描述：栏位与显隐取自模板，皮肤取模板指定值（未指定交由前端取首套），
     * 业务数据取配置中心的模块默认值
     */
    private static ResumeComponent buildResumeComponent(String model, ResumeTemplateDetail templateDetail, ResumeModelDataConfig modelDataConfig) {
        ResumeComponent component = new ResumeComponent();
        component.setKeyId(IdUtils.getIdStr());
        component.setModel(model);
        component.setShow(true);
        component.setData(copyConfigModelData(modelDataConfig, model));
        if (templateDetail == null) {
            return component;
        }
        component.setLayout(LAYOUT_LEFT_RIGHT.equals(templateDetail.getLayout()) ? leftRightLayoutOf(templateDetail, model) : StringUtils.EMPTY);
        component.setShow(!isHidden(templateDetail, model));
        component.setCptName(cptNameOf(templateDetail, model));
        return component;
    }

    /**
     * 深拷贝一份模块默认数据，避免多份简历共享同一个配置对象
     */
    private static Map<String, Object> copyConfigModelData(ResumeModelDataConfig modelDataConfig, String model) {
        if (Objects.isNull(modelDataConfig) || Objects.isNull(modelDataConfig.getModelData())) {
            return null;
        }
        Object data = modelDataConfig.getModelData().get(model);
        if (Objects.isNull(data)) {
            return null;
        }
        return JsonUtils.parseObj(data);
    }

    /**
     * 双列布局下模块的左右栏归属
     */
    private static String leftRightLayoutOf(ResumeTemplateDetail templateDetail, String model) {
        ResumeTemplateDetail.Columns columns = templateDetail.getColumns();
        if (columns == null) {
            return StringUtils.EMPTY;
        }
        if (columns.getLeft() != null && columns.getLeft().contains(model)) {
            return "left";
        }
        if (columns.getRight() != null && columns.getRight().contains(model)) {
            return "right";
        }
        return StringUtils.EMPTY;
    }

    /**
     * 模块是否被模板声明为初始隐藏
     */
    private static boolean isHidden(ResumeTemplateDetail templateDetail, String model) {
        List<String> hidden = templateDetail.getHidden();
        return hidden != null && hidden.contains(model);
    }

    /**
     * 按模块名取模板指定的皮肤名，未配置返回 null
     */
    private static String cptNameOf(ResumeTemplateDetail templateDetail, String model) {
        ResumeTemplateDetail.Variants variants = templateDetail.getVariants();
        if (variants == null) {
            return null;
        }
        switch (model) {
            case "AWARDS":
                return variants.getAwards();
            case "HOBBIES":
                return variants.getHobbies();
            case "BASE_INFO":
                return variants.getBaseInfo();
            case "JOB_INTENTION":
                return variants.getJobIntention();
            case "WORKS_DISPLAY":
                return variants.getWorksDisplay();
            case "EDU_BACKGROUND":
                return variants.getEduBackground();
            case "SELF_EVALUATION":
                return variants.getSelfEvaluation();
            case "WORK_EXPERIENCE":
                return variants.getWorkExperience();
            case "CAMPUS_EXPERIENCE":
                return variants.getCampusExperience();
            case "SKILL_SPECIALTIES":
                return variants.getSkillSpecialties();
            case "PROJECT_EXPERIENCE":
                return variants.getProjectExperience();
            case "INTERNSHIP_EXPERIENCE":
                return variants.getInternshipExperience();
            default:
                return null;
        }
    }

}