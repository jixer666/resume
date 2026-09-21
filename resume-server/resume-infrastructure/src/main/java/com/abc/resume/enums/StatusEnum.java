package com.abc.resume.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum StatusEnum {

    NORMAL(1, "正常"),
    BAN(2, "禁用");

    private int status;
    private String desc;

}
