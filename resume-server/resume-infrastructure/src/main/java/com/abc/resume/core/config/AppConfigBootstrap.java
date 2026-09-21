package com.abc.resume.core.config;

import cn.hutool.core.util.BooleanUtil;
import com.abc.resume.core.config.annoation.AfterUpdate;
import com.abc.resume.core.config.annoation.BeforeUpdate;
import com.abc.resume.core.config.annoation.ConfigAttribute;
import com.abc.resume.core.config.annoation.ConfigComponent;
import com.abc.resume.core.config.model.Config;
import com.abc.resume.core.config.model.ConfigUpdateInvoker;
import com.abc.resume.core.config.parser.ConfigMapParser;
import com.abc.resume.core.config.parser.ConfigParser;
import com.abc.resume.util.NumberUtils;
import com.abc.resume.util.ReflectionUtils;
import com.abc.resume.util.StringUtils;
import com.alibaba.fastjson2.JSON;
import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.config.BeanPostProcessor;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;

import java.lang.reflect.*;
import java.util.List;
import java.util.Map;
import java.util.Objects;

/**
 * 配置中心
 */
@Slf4j
public class AppConfigBootstrap implements BeanPostProcessor, ApplicationListener<ContextRefreshedEvent> {

    private final static List<ConfigUpdateInvoker> CONFIG_BEFORE_UPDATE_INVOKERS = Lists.newArrayList();
    private final static List<ConfigUpdateInvoker> CONFIG_AFTER_UPDATE_INVOKERS = Lists.newArrayList();
    private final static Map<String, Field> CONFIG_FIELD_CACHE = Maps.newConcurrentMap();
    private final static Map<String, ConfigParser> CONFIG_PARSER_CACHE = Maps.newConcurrentMap();
    private final static Map<String, ConfigMapParser> CONFIG_MAP_PARSER_CACHE = Maps.newConcurrentMap();
    private final static Map<String, Object> CONFIG_COMPONENT_CACHE = Maps.newConcurrentMap();
    private ApplicationContext applicationContext;

    @Override
    public void onApplicationEvent(@NotNull ContextRefreshedEvent event) {
        applicationContext = event.getApplicationContext();
    }

    @Override
    public Object postProcessBeforeInitialization(@NotNull Object bean, @NotNull String beanName) throws BeansException {
        registerOnUpdateAnnotation(bean);
        return bean;
    }

    @Override
    public Object postProcessAfterInitialization(@NotNull Object bean, @NotNull String beanName) throws BeansException {
        registerConfigResource(bean);
        return bean;
    }

    private void registerConfigResource(Object bean) {
        ConfigComponent configComponent = bean.getClass().getAnnotation(ConfigComponent.class);
        if (Objects.isNull(configComponent)) {
            // 不是配置中心类
            return;
        }
        String componentKey = configComponent.value();
        CONFIG_COMPONENT_CACHE.put(componentKey, bean);
        // 加载配置中心的字段
        registerConfigAttribute(componentKey, bean.getClass());
    }

    private void registerConfigAttribute(String componentKey, Class<?> clazz) {
        if (clazz == Object.class || clazz.isAssignableFrom(Object.class)) {
            return;
        }
        registerConfigAttribute(componentKey, clazz.getSuperclass());
        Field[] fields = clazz.getDeclaredFields();
        for (Field field : fields) {
            ConfigAttribute configAttribute = field.getAnnotation(ConfigAttribute.class);
            if (configAttribute == null) {
                continue;
            }
            try {
                field.setAccessible(true);
                String configName = getConfigName(componentKey, field.getName());
                CONFIG_FIELD_CACHE.put(configName, field);
                Class<?> parserType = configAttribute.configParser();
                Object configParser;
                try {
                    configParser = applicationContext.getBean(parserType);
                } catch (Exception ee) {
                    configParser = parserType.newInstance();
                }
                if (configParser instanceof ConfigParser) {
                    CONFIG_PARSER_CACHE.put(configName, (ConfigParser) configParser);
                }
                if (configParser instanceof ConfigMapParser) {
                    CONFIG_MAP_PARSER_CACHE.put(configName, (ConfigMapParser) configParser);
                }
            } catch (Exception e) {
                log.warn("解析配置属性失败, field: {}", field.getName(), e);
            }
        }
    }

    private void registerOnUpdateAnnotation(Object bean) {
        List<Method> beforeUpdateMethods = ReflectionUtils.findMethodsWithAnnotation(bean.getClass(), BeforeUpdate.class);
        for (Method method : beforeUpdateMethods) {
            BeforeUpdate beforeUpdate = method.getAnnotation(BeforeUpdate.class);
            if (Objects.isNull(beforeUpdate)) {
                continue;
            }
            ConfigUpdateInvoker configUpdateInvoker = new ConfigUpdateInvoker();
            configUpdateInvoker.setParameterClass(method.getParameterTypes()[0]);
            configUpdateInvoker.setGenericParameterType(method.getGenericParameterTypes()[0]);
            configUpdateInvoker.setTargetClass(method.getDeclaringClass());
            configUpdateInvoker.setTargetMethod(method);
            configUpdateInvoker.setTargetObject(bean);
            configUpdateInvoker.setAttribute(beforeUpdate.attribute());
            configUpdateInvoker.setConfigParser(beforeUpdate.configParser());
            CONFIG_BEFORE_UPDATE_INVOKERS.add(configUpdateInvoker);
        }

        List<Method> afterUpdateMethods = ReflectionUtils.findMethodsWithAnnotation(bean.getClass(), AfterUpdate.class);
        for (Method method : afterUpdateMethods) {
            AfterUpdate afterUpdate = method.getAnnotation(AfterUpdate.class);
            if (Objects.isNull(afterUpdate)) {
                continue;
            }
            ConfigUpdateInvoker configUpdateInvoker = new ConfigUpdateInvoker();
            configUpdateInvoker.setParameterClass(method.getParameterTypes()[0]);
            configUpdateInvoker.setGenericParameterType(method.getGenericParameterTypes()[0]);
            configUpdateInvoker.setTargetClass(method.getDeclaringClass());
            configUpdateInvoker.setTargetMethod(method);
            configUpdateInvoker.setTargetObject(bean);
            configUpdateInvoker.setAttribute(afterUpdate.attribute());
            configUpdateInvoker.setConfigParser(afterUpdate.configParser());
            CONFIG_AFTER_UPDATE_INVOKERS.add(configUpdateInvoker);
        }
    }

    public void handleUpdateConfig(Config config) {
        beforeUpdateNotify(config);
        doUpdateConfig(config);
        afterUpdateNotify(config);
    }

    private void doUpdateConfig(Config config) {
        String configName = getConfigName(config.getGroup(), config.getCode());
        Field field = CONFIG_FIELD_CACHE.get(configName);
        if (Objects.isNull(field)) {
            return;
        }
        Object bean = CONFIG_COMPONENT_CACHE.get(config.getGroup());
        if (Objects.isNull(bean)) {
            return;
        }
        try {
            field.setAccessible(true);
            field.set(bean, adaptive(configName, config, field));
        } catch (Exception e) {
            log.error("执行更新配置{}失败", configName, e);
        }
    }

    private static String getConfigName(String configGroup, String configKey) {
        return String.format("%s.%s", configGroup, configKey);
    }

    private void beforeUpdateNotify(Config config) {
        for (ConfigUpdateInvoker invoker : CONFIG_BEFORE_UPDATE_INVOKERS) {
            try {
                doInvoke(config, invoker);
            } catch (Exception e) {
                log.error("执行{}前置更新通知失败", config.getCode(), e);
            }
        }
    }

    private static void doInvoke(Config config, ConfigUpdateInvoker invoker) throws InstantiationException, IllegalAccessException, InvocationTargetException {
        if (!invoker.canInvoke(config.getCode())) {
            return;
        }
        Class<?> configParserClazz = invoker.getConfigParser();
        if (configParserClazz != null) {
            Object obj = adaptive(configParserClazz.newInstance(), config, invoker.getParameterClass(), invoker.getGenericParameterType());
            invoker.invoke(obj);
        }
    }

    private void afterUpdateNotify(Config config) {
        for (ConfigUpdateInvoker invoker : CONFIG_AFTER_UPDATE_INVOKERS) {
            try {
                doInvoke(config, invoker);
            } catch (Exception e) {
                log.error("执行{}后置更新通知失败", config.getCode(), e);
            }
        }
    }

    private static Object adaptive(Object configParser, Config config, Class<?> fieldClazz, Type parameterizedType) {
        String configValue = config.getValue();
        if (StringUtils.isBlank(configValue)) {
            return null;
        }
        if (fieldClazz.isPrimitive() || isWrapClass(fieldClazz)) {
            return parsePrimitive(configValue, fieldClazz);
        } else if (String.class.isAssignableFrom(fieldClazz)) {
            return configValue;
        } else if (fieldClazz.isArray()) {
            if (!(configParser instanceof ConfigParser)) {
                return null;
            }
            return ((ConfigParser) configParser).parseArray(config, ReflectionUtils.findParameterizedType((ParameterizedType) parameterizedType));
        } else if (fieldClazz.isAssignableFrom(List.class)) {
            if (!(configParser instanceof ConfigParser)) {
                return null;
            }
            return ((ConfigParser) configParser).parseList(config, ReflectionUtils.findParameterizedType((ParameterizedType) parameterizedType));
        } else if (fieldClazz.isAssignableFrom(Map.class)) {
            if (!(configParser instanceof ConfigMapParser)) {
                return null;
            }
            return ((ConfigMapParser) configParser).parseMap(config);
        } else if (Object.class.isAssignableFrom(fieldClazz)) {
            return JSON.parseObject(configValue, fieldClazz);
        }
        return null;
    }

    private static Object adaptive(String configName, Config config, Field field) {
        Class<?> fieldClazz = field.getType();
        String configValue = config.getValue();
        if (StringUtils.isBlank(configValue)) {
            return null;
        }
        if (fieldClazz.isPrimitive() || isWrapClass(fieldClazz)) {
            return parsePrimitive(configValue, fieldClazz);
        } else if (String.class.isAssignableFrom(fieldClazz)) {
            return configValue;
        } else if (fieldClazz.isArray()) {
            ConfigParser configParser = CONFIG_PARSER_CACHE.get(configName);
            if (configParser == null) {
                return null;
            }
            return configParser.parseArray(config, ReflectionUtils.findParameterizedType((ParameterizedType) field.getGenericType()));
        } else if (List.class.isAssignableFrom(fieldClazz)) {
            ConfigParser configParser = CONFIG_PARSER_CACHE.get(configName);
            if (configParser == null) {
                return null;
            }
            return configParser.parseList(config, ReflectionUtils.findParameterizedType((ParameterizedType) field.getGenericType()));
        } else if (Map.class.isAssignableFrom(fieldClazz)) {
            ConfigMapParser configParser = CONFIG_MAP_PARSER_CACHE.get(configName);
            if (configParser == null) {
                return null;
            }
            return configParser.parseMap(config);
        } else if (Object.class.isAssignableFrom(fieldClazz)) {
            return JSON.parseObject(configValue, fieldClazz);
        }
        return null;
    }

    private static Object parsePrimitive(String configValue, Class<?> fileClazz) {
        if ("int".equals(fileClazz.getName()) || Integer.class.isAssignableFrom(fileClazz)) {
            return NumberUtils.toInt(configValue);
        } else if ("double".equals(fileClazz.getName()) || Double.class.isAssignableFrom(fileClazz)) {
            return NumberUtils.toDouble(configValue);
        } else if ("float".equals(fileClazz.getName()) || Float.class.isAssignableFrom(fileClazz)) {
            return NumberUtils.toFloat(configValue);
        } else if ("long".equals(fileClazz.getName()) || Long.class.isAssignableFrom(fileClazz)) {
            return NumberUtils.toLong(configValue);
        } else if ("short".equals(fileClazz.getName()) || Short.class.isAssignableFrom(fileClazz)) {
            return NumberUtils.toShort(configValue);
        } else if ("boolean".equals(fileClazz.getName()) || Boolean.class.isAssignableFrom(fileClazz)) {
            return BooleanUtil.toBoolean(configValue);
        } else if ("byte".equals(fileClazz.getName()) || Byte.class.isAssignableFrom(fileClazz)) {
            return NumberUtils.toByte(configValue);
        } else if ("char".equals(fileClazz.getName()) || Character.class.isAssignableFrom(fileClazz)) {
            return configValue;
        }
        return null;
    }

    private static boolean isWrapClass(Class clz) {
        try {
            return ((Class) clz.getField("TYPE").get(null)).isPrimitive();
        } catch (Exception e) {
            return false;
        }
    }

}