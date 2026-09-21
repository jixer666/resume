package com.abc.resume.core.strategy;

import com.abc.resume.util.ReflectionUtils;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.config.BeanPostProcessor;
import org.springframework.stereotype.Component;

import java.lang.annotation.Annotation;

@Slf4j
@Component
public class StrategyBootstrap extends ServiceProvider implements BeanPostProcessor {

    @Override
    public Object postProcessBeforeInitialization(@NotNull Object bean, @NotNull String beanName) throws BeansException {
        Annotation[] annotations = bean.getClass().getAnnotations();
        if (annotations.length == 0) {
            return bean;
        }
        Annotation strategy = null;
        for (Annotation annotation : annotations) {
            if (annotation.annotationType().isAnnotationPresent(Strategy.class)) {
                strategy = annotation;
                break;
            }
        }
        if (strategy == null) {
            return bean;
        }
        Object object = ReflectionUtils.getAnnotationValue(strategy, "value");
        if (object == null) {
            return bean;
        }
        //value支持数组
        if (ReflectionUtils.isArray(object)) {
            Object[] arrays = (Object[]) object;
            for (Object key : arrays) {
                registerBeanName(key, beanName);
            }
            return bean;
        }
        registerBeanName(object, beanName);
        return bean;
    }


}
