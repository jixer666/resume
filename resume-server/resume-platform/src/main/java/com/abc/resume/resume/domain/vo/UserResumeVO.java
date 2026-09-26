package com.abc.resume.resume.domain.vo;

import com.abc.resume.resume.domain.entity.resume.UserResumeDetail;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.util.Date;

/**
 * 用户简历
 *
 * @author LiJunXi
 * @date 2026/9/25
 */
@Data
public class UserResumeVO {

    /** 主键（新建前不存在） */
    private Long id;

    /** 简历名称，取自简历 JSON 的 NAME（不落库，展示用） */
    private String name;

    /** 布局：leftRight 双列，其余单列，取自简历 JSON 的 LAYOUT（不落库，展示用） */
    private String layout;

    /** 缩略图地址，未生成时为空串 */
    private String thumbnail;

    /** 整份简历详情，列表接口不返回（为 null），详情 / 保存接口返回 */
    private UserResumeDetail resumeJson;

    /** 更新时间 */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date updateTime;

}
