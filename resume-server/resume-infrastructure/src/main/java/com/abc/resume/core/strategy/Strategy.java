package com.abc.resume.core.strategy;

import java.lang.annotation.*;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented // 将该注解信息包含在生成的Javadoc中
@Inherited // 允许子类继承父类的该注解
public @interface Strategy {
}
