package com.abc.resume.system.utils;

import com.abc.resume.system.domain.dto.LoginUserDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Objects;

@Slf4j
public class SecurityUtils {

    /**
     * 判断密码是否相同
     *
     * @param rawPassword 真实密码
     * @param encodedPassword 加密后字符
     */
    public static boolean matchesPassword(String rawPassword, String encodedPassword) {
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }


    public static String getUserId() {
        try {
            LoginUserDTO loginUser = getLoginUser();
            if (Objects.isNull(loginUser)) {
                return null;
            }
            return loginUser.getUserId();
        } catch (Exception e) {
            return null;
        }
    }


    /**
     * 获取用户
     */
    public static LoginUserDTO getLoginUser() {
        try {
            Object principal = getAuthentication().getPrincipal();
            if (principal instanceof LoginUserDTO) {
                return (LoginUserDTO) principal;
            }
            // 未登录或匿名用户，principal为anonymousUser字符串
            return null;
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * 获取Authentication
     */
    public static Authentication getAuthentication() {
        return SecurityContextHolder.getContext().getAuthentication();
    }
}
