package com.abc.resume.system.domain.dto;

import lombok.Data;

@Data
public class LoginDTO {

    /**
     * 用户名
     */
    private String username;

    /**
     * 用户密码
     */
    private String password;

    /**
     * 验证码
     */
    private String code;

    /**
     * 唯一标识
     */
    private String uuid;

    /**
     * 登录方式
     */
    private Integer authType;

}
