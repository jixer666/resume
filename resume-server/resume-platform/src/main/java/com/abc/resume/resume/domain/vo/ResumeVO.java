package com.abc.resume.resume.domain.vo;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.Data;

import java.util.Date;

/**
 * 简历出参
 */
@Data
public class ResumeVO {

    private Long id;

    /** 简历名称 */
    private String name;

    /** 布局标识 */
    private String layout;

    /** 缩略图地址 */
    private String thumbnail;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date updateTime;

    /** 整份简历JSON，列表接口不返回 */
    private JsonNode resumeJson;

}
