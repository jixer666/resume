package com.abc.resume.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class EnvironmentUtils {
    
    private static Environment staticEnvironment;
    
    @Autowired
    public void setEnvironment(Environment environment) {
        EnvironmentUtils.staticEnvironment = environment;
    }
    
    /**
     * 判断是否为开发环境
     */
    public static boolean isDev() {
        return isProfile("dev");
    }
    
    /**
     * 判断是否为测试环境
     */
    public static boolean isTest() {
        return isProfile("test");
    }
    
    /**
     * 判断是否为生产环境
     */
    public static boolean isProd() {
        return isProfile("prod");
    }
    
    /**
     * 判断是否包含指定环境
     */
    public static boolean isProfile(String profile) {
        if (staticEnvironment == null) {
            return false;
        }
        return Arrays.asList(staticEnvironment.getActiveProfiles()).contains(profile);
    }
    
    /**
     * 获取所有激活的环境
     */
    public static String[] getActiveProfiles() {
        if (staticEnvironment == null) {
            return new String[0];
        }
        return staticEnvironment.getActiveProfiles();
    }
    
    /**
     * 获取当前环境（多个时返回第一个）
     */
    public static String getCurrentProfile() {
        String[] profiles = getActiveProfiles();
        return profiles.length > 0 ? profiles[0] : "unknown";
    }
}