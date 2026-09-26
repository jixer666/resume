package com.abc.resume.resume.domain.entity.resume;

import com.fasterxml.jackson.annotation.JsonAnyGetter;
import com.fasterxml.jackson.annotation.JsonAnySetter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * 简历全局样式
 */
@Data
public class GlobalStyle {

    /** 主题色 */
    private String themeColor;

    /** 一级标题字体大小 */
    private String firstTitleFontSize;

    /** 二级标题字体大小 */
    private String secondTitleFontSize;

    /** 正文字体大小 */
    private String textFontSize;

    /** 二级标题颜色 */
    private String secondTitleColor;

    /** 正文字体颜色 */
    private String textFontColor;

    /** 二级标题字体粗细 */
    private Integer secondTitleWeight;

    /** 正文字体粗细 */
    private Integer textFontWeight;

    /** 上内边距 */
    private String pTop;

    /** 下内边距 */
    private String pBottom;

    /** 左右内边距 */
    private String pLeftRight;

    /** 模块上边距 */
    private String modelMarginTop;

    /** 模块下边距 */
    private String modelMarginBottom;

    /** 左右布局时左侧宽度 */
    private String leftWidth;

    /** 左右布局时右侧宽度 */
    private String rightWidth;

    /** 左右布局时左侧背景色 */
    private String leftThemeColor;

    /** 左右布局时右侧背景色 */
    private String rightThemeColor;

    /** 字体 */
    private String fontFamily;

    /** 未声明的样式字段，原样透传 */
    @JsonIgnore
    private Map<String, Object> extra = new LinkedHashMap<>();

    @JsonAnySetter
    public void putExtra(String key, Object value) {
        extra.put(key, value);
    }

    @JsonAnyGetter
    public Map<String, Object> extraFields() {
        return extra;
    }

}