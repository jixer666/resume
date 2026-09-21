package com.abc.resume.core.strategy;

import com.abc.resume.enums.ExceptionEnum;
import com.abc.resume.util.AssertUtils;
import com.google.common.collect.Maps;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.util.Map;

@Component
public class ServiceProvider {
    // 枚举类:Bean名称
    private static final Map<Object, String> BEAN_NAME_MAP = Maps.newHashMap();

    @Resource
    private ApplicationContext applicationContext;

    void registerBeanName(Object key, String value) {
        BEAN_NAME_MAP.put(key, value);
    }

    public <T> T getService(Enum e, Class<T> beanClass) {
        if (e == null) {
            return null;
        }
        String beanName = BEAN_NAME_MAP.getOrDefault(e, "");
        AssertUtils.isNotEmpty(beanName, ExceptionEnum.PARAM_EXCEPTION);
        return applicationContext.getBean(beanName, beanClass);
    }
}
