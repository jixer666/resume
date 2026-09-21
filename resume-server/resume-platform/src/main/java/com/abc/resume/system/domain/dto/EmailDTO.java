package com.abc.resume.system.domain.dto;

import lombok.Data;

import java.util.HashMap;
import java.util.Map;

@Data
public class EmailDTO {

    private String email;

    // 生成验证码过程中的参数
    private Integer emailType;
    private String emailUuid;
    private String emailCode;

    // 发送邮件设置参数
    private String from;
    private String to;
    private Map<String,String> detailsMap = new HashMap<>();

}
