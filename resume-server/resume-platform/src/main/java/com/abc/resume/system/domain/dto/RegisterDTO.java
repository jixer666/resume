package com.abc.resume.system.domain.dto;

import lombok.Data;

@Data
public class RegisterDTO {

    /**
     * 用户名
     */
    private String username;

    /**
     * 用户密码
     */
    private String password;

    /**
     * 用户密码
     */
    private String passwordAgain;

    /**
     * 验证码
     */
    private String code;

    /**
     * 唯一标识
     */
    private String uuid;

    /**
     * 认证方式
     */
    private Integer authType;

    /**
     * 邮箱
     */
    private String email;

    /**
     * 邮箱验证码
     */
    private String emailCode;

    /**
     * 邮箱唯一标识
     */
    private String emailUuid;

    /**
     * openid
     */
    private String openid;

    /**
     * 渠道
     */
    private String ch;
}
