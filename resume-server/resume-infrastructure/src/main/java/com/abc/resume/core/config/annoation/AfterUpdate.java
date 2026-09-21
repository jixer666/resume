package com.abc.resume.core.config.annoation;

import com.abc.resume.core.config.parser.DefaultConfigParser;

import java.lang.annotation.*;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface AfterUpdate {
    /**
     * 配置的名字
     */
    String attribute();

    /**
     * 配置解析器
     */
    Class<?> configParser() default DefaultConfigParser.class;
}
