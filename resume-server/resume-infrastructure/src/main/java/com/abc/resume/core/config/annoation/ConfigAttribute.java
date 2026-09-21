package com.abc.resume.core.config.annoation;

import com.abc.resume.core.config.parser.DefaultConfigParser;

import java.lang.annotation.*;

@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface ConfigAttribute {
    String value() default "";

    Class<?> configParser() default DefaultConfigParser.class;
}
