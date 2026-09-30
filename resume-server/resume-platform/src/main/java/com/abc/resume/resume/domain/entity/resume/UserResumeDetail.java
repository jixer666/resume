package com.abc.resume.resume.domain.entity.resume;

import com.abc.resume.resume.domain.entity.ResumeTemplate;
import com.abc.resume.resume.domain.entity.template.ResumeTemplateColumn;
import com.abc.resume.resume.domain.entity.template.ResumeTemplateDetail;
import com.abc.resume.resume.domain.entity.template.ResumeTemplateStyle;
import com.abc.resume.resume.domain.entity.template.ResumeTemplateVariant;
import com.abc.resume.system.domain.entity.config.ResumeTemplateConfig;
import com.abc.resume.util.IdUtils;
import com.abc.resume.util.JsonUtils;
import com.abc.resume.util.StringUtils;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.*;
import java.util.stream.Collectors;

/**
 * 用户简历详情
 */
@Data
public class UserResumeDetail {

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
     * 按模板构造一份简历骨架
     */
    public static UserResumeDetail fromTemplate(ResumeTemplate template, ResumeTemplateConfig templateConfig) {
        UserResumeDetail detail = new UserResumeDetail();
        detail.setName(DEFAULT_RESUME_NAME);
        detail.setGlobalStyle(buildDefaultGlobalStyle(templateConfig));
        if (Objects.isNull(template)) {
            return detail;
        }
        ResumeTemplateDetail templateDetail = template.getTemplateDetail();
        if (Objects.isNull(templateDetail)) {
            return detail;
        }
        detail.setLayout(templateDetail.getLayout());
        applyStyle(detail.getGlobalStyle(), templateDetail.getStyle());
        ResumeTemplateVariant variants = templateDetail.getVariants();
        List<ResumeComponent> components = Objects.isNull(variants) ? Collections.emptyList()
                : variants.getValidFieldList().stream()
                .filter(model -> !isHidden(templateDetail, model))
                .map(model -> buildResumeComponent(model, templateDetail, templateConfig))
                .collect(Collectors.toList());
        detail.setComponents(components);

        return detail;
    }

    /**
     * 默认全局样式
     */
    private static GlobalStyle buildDefaultGlobalStyle(ResumeTemplateConfig modelDataConfig) {
        if (Objects.isNull(modelDataConfig) || Objects.isNull(modelDataConfig.getGlobalStyle()) || modelDataConfig.getGlobalStyle().isEmpty()) {
            return buildBuiltinGlobalStyle();
        }
        return JsonUtils.toBean(JsonUtils.parseObj(modelDataConfig.getGlobalStyle()), GlobalStyle.class);
    }

    /**
     * 内置兜底全局样式（配置中心未下发 globalStyle 时使用）
     */
    private static GlobalStyle buildBuiltinGlobalStyle() {
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
        style.setModelMarginBottom("0px");
        style.setLeftWidth(StringUtils.EMPTY);
        style.setRightWidth(StringUtils.EMPTY);
        style.setLeftThemeColor(StringUtils.EMPTY);
        style.setRightThemeColor(StringUtils.EMPTY);
        style.setResumeBackgroundCom(StringUtils.EMPTY);
        return style;
    }

    /**
     * 把模板样式里非空字段覆盖到全局样式上
     */
    private static void applyStyle(GlobalStyle target, ResumeTemplateStyle source) {
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
        if (StringUtils.isNotBlank(source.getResumeBackgroundCom())) {
            target.setResumeBackgroundCom(source.getResumeBackgroundCom());
        }
        // 小标题样式是前端预设，后端不解释：GlobalStyle 未声明的字段原样透传
        if (StringUtils.isNotBlank(source.getTitleStyle())) {
            target.putExtra("titleStyle", source.getTitleStyle());
        }
    }

    /**
     * 构造单个模块简历模块实例
     */
    private static ResumeComponent buildResumeComponent(String model, ResumeTemplateDetail templateDetail, ResumeTemplateConfig modelDataConfig) {
        ResumeComponent component = new ResumeComponent();
        component.setKeyId(IdUtils.getIdStr());
        component.setModel(model);
        component.setShow(true);
        component.setData(copyConfigModelData(modelDataConfig, model));
        component.setStyle(buildModelStyle(modelDataConfig, templateDetail, model));
        if (templateDetail == null) {
            return component;
        }
        component.setLayout(LAYOUT_LEFT_RIGHT.equals(templateDetail.getLayout()) ? leftRightLayoutOf(templateDetail, model) : StringUtils.EMPTY);
        component.setCptName(cptNameOf(templateDetail, model));
        return component;
    }

    /**
     * 深拷贝一份模块默认数据，避免多份简历共享同一个配置对象
     */
    private static Map<String, Object> copyConfigModelData(ResumeTemplateConfig modelDataConfig, String model) {
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
     * 深拷贝一份模块默认样式，避免多份简历共享同一个配置对象
     */
    private static Map<String, Object> copyConfigModelStyle(ResumeTemplateConfig modelDataConfig, String model) {
        if (Objects.isNull(modelDataConfig) || Objects.isNull(modelDataConfig.getModelStyle())) {
            return null;
        }
        Object style = modelDataConfig.getModelStyle().get(model);
        if (Objects.isNull(style)) {
            return null;
        }
        return JsonUtils.parseObj(style);
    }

    private static Map<String, Object> buildModelStyle(ResumeTemplateConfig modelDataConfig, ResumeTemplateDetail templateDetail, String model) {
        Map<String, Object> style = copyConfigModelStyle(modelDataConfig, model);
        if (Objects.isNull(style)) {
            style = new LinkedHashMap<>();
        }
        if (Objects.nonNull(templateDetail)) {
            applyTemplateStyle(style, templateDetail.getStyle());
        }
        return style.isEmpty() ? null : style;
    }

    /**
     * 把模板的配置的全局样式设置到模块样式上
     */
    private static void applyTemplateStyle(Map<String, Object> style, ResumeTemplateStyle templateStyle) {
        if (Objects.isNull(templateStyle)) {
            return;
        }
        putStyleIfPresent(style, "themeColor", templateStyle.getThemeColor());
        putStyleIfPresent(style, "firstTitleFontSize", templateStyle.getFirstTitleFontSize());
        putStyleIfPresent(style, "titleFontSize", templateStyle.getSecondTitleFontSize());
        putStyleIfPresent(style, "titleColor", templateStyle.getSecondTitleColor());
        putStyleIfPresent(style, "titleFontWeight", templateStyle.getSecondTitleWeight());
        putStyleIfPresent(style, "textFontSize", templateStyle.getTextFontSize());
        putStyleIfPresent(style, "textColor", templateStyle.getTextFontColor());
        putStyleIfPresent(style, "textFontWeight", templateStyle.getTextFontWeight());
        putStyleIfPresent(style, "pTop", templateStyle.getPTop());
        putStyleIfPresent(style, "pBottom", templateStyle.getPBottom());
        putStyleIfPresent(style, "pLeftRight", templateStyle.getPLeftRight());
        putStyleIfPresent(style, "mTop", templateStyle.getModelMarginTop());
        putStyleIfPresent(style, "mBottom", templateStyle.getModelMarginBottom());
        putStyleIfPresent(style, "titleStyle", templateStyle.getTitleStyle());
    }

    private static void putStyleIfPresent(Map<String, Object> style, String key, Object value) {
        if (Objects.isNull(value)) {
            return;
        }
        if (value instanceof CharSequence && StringUtils.isBlank((CharSequence) value)) {
            return;
        }
        style.put(key, value);
    }

    /**
     * 双列布局下模块的左右栏归属
     */
    private static String leftRightLayoutOf(ResumeTemplateDetail templateDetail, String model) {
        ResumeTemplateColumn columns = templateDetail.getColumns();
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
        ResumeTemplateVariant variants = templateDetail.getVariants();
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
