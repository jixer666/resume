package com.abc.resume.security;

import cn.hutool.json.JSONUtil;
import com.abc.resume.core.result.ApiResult;
import com.abc.resume.enums.ExceptionEnum;
import com.abc.resume.util.ServletUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.Serializable;

@Slf4j
@Component
public class AuthenticationEntryPointImpl implements AuthenticationEntryPoint, Serializable {
    private static final long serialVersionUID = -8970748410737709602L;

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException e) {
        log.error("认证失败: {} {}, 原因: {}", request.getMethod(), request.getRequestURI(), e.getMessage());
        ServletUtils.renderString(response, JSONUtil.toJsonStr(ApiResult.fail(ExceptionEnum.UNAUTHORIZED_EXCEPTION)));
    }
}
