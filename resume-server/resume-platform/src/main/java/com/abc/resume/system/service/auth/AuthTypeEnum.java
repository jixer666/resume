package com.abc.resume.system.service.auth;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum AuthTypeEnum {

    ACCOUNT(1, "账号认证"),
    WX(2, "微信认证"),

    ;

    private final Integer type;
    private final String loginClass;

    public static AuthTypeEnum typeOf(Integer authType) {
        for (AuthTypeEnum authTypeEnum : AuthTypeEnum.values()) {
            if (authTypeEnum.type.equals(authType)) {
                return authTypeEnum;
            }
        }
        return null;
    }
}
