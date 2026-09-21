package com.abc.resume.core.config.annoation;

import java.lang.annotation.*;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface ConfigComponent {
    String value() default "";
}
