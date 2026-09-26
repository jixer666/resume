package com.abc.resume.resume.domain.entity.template;

import lombok.Data;

/**
 * 模板样式配置
 *
 * @author LiJunXi
 * @date 2026/9/26
 */
@Data
public class ResumeTemplateStyle {
    /**
     * 上边距
     */
    private String pTop;
    /**
     * 下边距
     */
    private String pBottom;
    /**
     * 左右边距（左右布局）
     */
    private String pLeftRight;
    /**
     * 主题色
     */
    private String themeColor;
    /**
     * 正文字体大小
     */
    private String textFontSize;
    /**
     * 正文字体颜色
     */
    private String textFontColor;
    /**
     * 模块上边距
     */
    private String modelMarginTop;
    /**
     * 正文字体粗细
     */
    private Integer textFontWeight;
    /**
     * 二级标题颜色
     */
    private String secondTitleColor;
    /**
     * 模块下边距
     */
    private String modelMarginBottom;
    /**
     * 二级标题粗细
     */
    private Integer secondTitleWeight;
    /**
     * 一级标题字体大小
     */
    private String firstTitleFontSize;
    /**
     * 二级标题字体大小
     */
    private String secondTitleFontSize;
    /**
     * 左右布局时左侧宽度
     */
    private String leftWidth;
    /**
     * 左右布局时右侧宽度
     */
    private String rightWidth;
    /**
     * 左右布局时左侧背景色
     */
    private String leftThemeColor;
    /**
     * 左右布局时右侧背景色
     */
    private String rightThemeColor;
}
