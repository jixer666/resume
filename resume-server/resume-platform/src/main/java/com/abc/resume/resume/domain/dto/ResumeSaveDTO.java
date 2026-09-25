package com.abc.resume.resume.domain.dto;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.Data;

/**
 * 简历保存入参
 */
@Data
public class ResumeSaveDTO {

    /** 简历ID，为空表示新建 */
    private Long id;

    /** 简历名称 */
    private String name;

    /** 布局标识 */
    private String layout;

    /** 缩略图地址 */
    private String thumbnail;

    /** 整份简历JSON */
    private JsonNode resumeJson;

}
