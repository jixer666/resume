package com.abc.resume.resume.domain.entity.resume;

import com.fasterxml.jackson.annotation.JsonAnyGetter;
import com.fasterxml.jackson.annotation.JsonAnySetter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * 简历模块实例
 */
@Data
public class ResumeComponent {

    /** 模块实例ID */
    private String keyId;

    /** 模块名，如 WORK_EXPERIENCE */
    private String model;

    /** 皮肤名，如 WORK_EXPERIENCE_9，未指定时为空 */
    private String cptName;

    /** 组件属性面板名 */
    private String cptOptionsName;

    /** 组件展示名 */
    private String cptTitle;

    /** 组件x坐标 */
    private Integer cptX;

    /** 组件y坐标 */
    private Integer cptY;

    /** 组件z坐标 */
    private Integer cptZ;

    /** 组件高度 */
    private String cptHeight;

    /** 组件宽度 */
    private String cptWidth;

    /** 双列布局下的栏位归属：left / right / 空串通栏 */
    private String layout;

    /** 是否显示 */
    private Boolean show;

    /** 模块样式 */
    private Map<String, Object> style;

    /** 模块业务数据 */
    private Map<String, Object> data;

    /** 未声明的字段，原样透传 */
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