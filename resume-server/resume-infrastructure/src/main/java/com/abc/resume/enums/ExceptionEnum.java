package com.abc.resume.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ExceptionEnum {

    SUCCESS(200, "成功", "成功"),
    SYSTEM_EXCEPTION(1000, "系统异常", "系统开小差了，请稍后再试"),
    PARAM_EXCEPTION(1001, "参数校验异常", "人气太火爆了，请稍后再试"),
    UNAUTHORIZED_EXCEPTION(1002, "身份未授权", "身份认证失败，请先登录哦！"),
    LOGIN_EXCEPTION(1003, "登录认证出错", "账号或者密码错误"),
    BIZ_EXCEPTION(1004, "业务异常", "人气太火爆了，请稍后再试"),
    PLAYER_NOT_FOUND(1005, "角色不存在", "请先创建角色"),
    TIME_SKEW(1006, "客户端时间偏差过大", "校准手机时间后重试"),

    ;

    private int code;
    private String desc;
    private String memo;

}
