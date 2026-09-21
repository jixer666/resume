package com.abc.resume.core.result;

import com.abc.resume.constants.HttpStatusConstants;
import com.abc.resume.enums.ExceptionEnum;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ApiResult<T> implements Serializable {

    private static final long serialVersionUID = 1L;

    private Integer code;

    private String msg;

    private T data;

    public static <T> ApiResult<T> success(T data) {
        return new ApiResult<>(HttpStatusConstants.SUCCESS, null, data);
    }

    public static <T> ApiResult<T> success() {
        return new ApiResult<>(HttpStatusConstants.SUCCESS, null, null);
    }

    public static <T> ApiResult<T> fail(String msg) {
        return new ApiResult<>(HttpStatusConstants.ERROR, msg, null);
    }

    public static <T> ApiResult<T> fail(Integer code, String msg) {
        return new ApiResult<>(code, msg, null);
    }

    public static <T> ApiResult<T> fail(ExceptionEnum exceptionEnum) {
        return new ApiResult<>(exceptionEnum.getCode(), exceptionEnum.getMemo(), null);
    }

}
