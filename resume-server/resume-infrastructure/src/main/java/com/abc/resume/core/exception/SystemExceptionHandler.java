package com.abc.resume.core.exception;

import com.abc.resume.core.result.ApiResult;
import com.abc.resume.enums.ExceptionEnum;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.net.BindException;

@Slf4j
@RestControllerAdvice
public class SystemExceptionHandler {

    @ExceptionHandler(value = GlobalException.class)
    public ApiResult<Void> handleGlobalException(GlobalException e) {
        log.error("自定义出现异常: {}, ", e.getMessage(), e);
        return ApiResult.fail(e.getCode(), e.getMessage());
    }

    @ExceptionHandler(value = InternalAuthenticationServiceException.class)
    public ApiResult<Void> handleInternalAuthenticationServiceException(InternalAuthenticationServiceException e) {
        log.error("认证出现异常: {}, ", e.getMessage(), e);
        return ApiResult.fail(ExceptionEnum.UNAUTHORIZED_EXCEPTION.getCode(), e.getMessage());
    }

    @ExceptionHandler(value = BindException.class)
    public ApiResult<Void> handleBindException(BindException e) {
        log.error("校验出现异常: {}, ", e.getMessage(), e);
        return ApiResult.fail(ExceptionEnum.PARAM_EXCEPTION);
    }

    @ExceptionHandler(value = Exception.class)
    public ApiResult<Void> handleException(Exception e) {
        log.error("系统出现异常: {}, ", e.getMessage(), e);
        return ApiResult.fail(ExceptionEnum.SYSTEM_EXCEPTION);
    }

}
