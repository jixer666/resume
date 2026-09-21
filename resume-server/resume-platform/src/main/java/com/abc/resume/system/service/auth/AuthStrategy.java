package com.abc.resume.system.service.auth;

import com.abc.resume.core.strategy.Strategy;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Strategy
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface AuthStrategy {

    AuthTypeEnum value();

}
