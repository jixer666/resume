package com.abc.resume.system.service.email;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum EmailTypeEnum {

    REGISTER(1, "注册邮箱"),
    FORGET(2, "忘记密码邮箱"),

    ;

    private final Integer type;
    private final String desc;

    public static EmailTypeEnum typeOf(Integer emailType) {
        for (EmailTypeEnum emailTypeEnum : EmailTypeEnum.values()) {
            if (emailTypeEnum.type.equals(emailType)) {
                return emailTypeEnum;
            }
        }
        return null;
    }
}
