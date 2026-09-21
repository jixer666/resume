package com.abc.resume.core.exception;

import com.abc.resume.enums.ExceptionEnum;
import lombok.Getter;

@Getter
public class GlobalException extends RuntimeException {

    private Integer code;

    public GlobalException(String message) {
        super(message);
        code = 500;
    }


    public GlobalException(Integer code, String message) {
        super(message);
        this.code = code;
    }

    public GlobalException(ExceptionEnum exceptionEnum) {
        super(exceptionEnum.getMemo());
        code = exceptionEnum.getCode();
    }

}