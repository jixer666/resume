package com.abc.resume.core.config.model;

import com.abc.resume.util.StringUtils;
import lombok.Data;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.lang.reflect.Type;

@Data
public class ConfigUpdateInvoker {
    protected Class<?> targetClass;
    private Object targetObject;
    private Method targetMethod;
    private Class<?> parameterClass;
    private Type genericParameterType;
    /**
     * 属性id
     */
    private String attribute;
    /**
     * 属性解析器
     */
    private Class<?> configParser;

    public Object invoke(Object... arguments) throws InvocationTargetException, IllegalAccessException {
        if (targetMethod == null) {
            return null;
        }
        targetMethod.setAccessible(true);
        return targetMethod.invoke(targetObject, arguments);
    }

    public boolean canInvoke(String configKey) {
        return StringUtils.equals(attribute, configKey);
    }
}
