package com.abc.resume.core.base;

import lombok.Data;

import java.util.Date;

@Data
public class BaseQueryContext {

    public static final Integer SORT_ASC = 1;
    public static final Integer SORT_DESC = 2;
    public static final Integer UPDATE_TIME_ASC = 3;
    public static final Integer UPDATE_TIME_DESC = 4;
    public static final Integer SORT_CREATE_TIME_ASC = 5;

    private Boolean delete;

    private Date createTime;

    private Date updateTime;

    private Integer ver;

    private Integer status;

    private Integer sort;

}
