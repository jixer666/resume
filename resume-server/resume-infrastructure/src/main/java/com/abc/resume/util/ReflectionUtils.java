package com.abc.resume.util;

import com.google.common.collect.Lists;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.Nullable;
import org.springframework.util.Assert;
import org.springframework.util.ConcurrentReferenceHashMap;

import java.lang.annotation.Annotation;
import java.lang.reflect.*;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import static org.springframework.util.ReflectionUtils.handleReflectionException;

@Slf4j
public class ReflectionUtils {

    private static final Method[] EMPTY_METHOD_ARRAY = new Method[0];
    private static final Object[] EMPTY_OBJECT_ARRAY = new Object[0];

    /**
     * Cache for {@link Class#getDeclaredMethods()} plus equivalent default methods
     * from Java 8 based interfaces, allowing for fast iteration.
     */
    private static final Map<Class<?>, Method[]> declaredMethodsCache = new ConcurrentReferenceHashMap<>(256);

    /**
     * Cache for {@link Class#getDeclaredFields()}, allowing for fast iteration.
     */
    private static final Map<Class<?>, Field[]> declaredFieldsCache = new ConcurrentReferenceHashMap<>(256);

    public static Class<?> findParameterizedType(ParameterizedType type) {
        Type[] actualTypes = type.getActualTypeArguments();
        if (actualTypes == null || actualTypes.length == 0) {
            return null;
        }
        return (Class<?>) actualTypes[0];
    }

    /**
     * 获取该注解对象的属性值
     *
     * @param annotation annotation
     * @param property   property
     * @return 注解value
     */
    public static Object getAnnotationValue(Annotation annotation, String property) {
        Object result = null;
        if (annotation != null) {
            InvocationHandler invocationHandler = Proxy.getInvocationHandler(annotation); //获取被代理的对象
            Map map = (Map) getFieldValue(invocationHandler, "memberValues");
            if (map != null) {
                result = map.get(property);
            }
        }
        return result;
    }

    @SuppressWarnings("all")
    public static <T> Object getFieldValue(T object, String property) {
        if (object != null && property != null) {
            Class<T> currClass = (Class<T>) object.getClass();

            try {
                Field field = currClass.getDeclaredField(property);
                field.setAccessible(true);
                return field.get(object);
            } catch (Exception e) {
                log.error("getFieldValue error", e);
            }
        }
        return null;
    }

    public static boolean isArray(Object obj) {
        if (obj == null) {
            return false;
        }

        return obj.getClass().isArray();
    }

    public static List<Method> findMethodsWithAnnotation(Class<?> clazz, Class<? extends Annotation> annotationClass) {
        if (clazz == null || annotationClass == null) {
            return null;
        }
        List<Method> finds = Lists.newArrayList();
        for (Class searchType = clazz; searchType != null; searchType = searchType.getSuperclass()) {
            Method[] methods = searchType.isInterface() ? searchType.getMethods() : getDeclaredMethods(searchType, false);
            for (Method method : methods) {
                if (method.isAnnotationPresent(annotationClass)) {
                    finds.add(method);
                }
            }
        }
        return finds;
    }

    public static List<Field> findPublicFieldsWithAnnotation(Class<?> clazz, Class<? extends Annotation> annotationClass) {
        if (clazz == null || annotationClass == null) {
            return null;
        }
        List<Field> finds = Lists.newArrayList();
        for (Class searchType = clazz; searchType != null; searchType = searchType.getSuperclass()) {
            if (searchType.isInterface()) {
                continue;
            }
            Field[] fields = clazz.getDeclaredFields();
            for (Field field : fields) {
                int modifiers = field.getModifiers();
                if (field.isAnnotationPresent(annotationClass) && (Modifier.isPublic(modifiers) && !Modifier.isStatic(modifiers))) {
                    finds.add(field);
                }
            }
        }
        return finds;
    }

    public static Method[] getDeclaredMethods(Class<?> clazz, boolean defensive) {
        Assert.notNull(clazz, "Class must not be null");
        Method[] result = declaredMethodsCache.get(clazz);
        if (result == null) {
            try {
                Method[] declaredMethods = clazz.getDeclaredMethods();
                List<Method> defaultMethods = findConcreteMethodsOnInterfaces(clazz);
                if (defaultMethods != null) {
                    result = new Method[declaredMethods.length + defaultMethods.size()];
                    System.arraycopy(declaredMethods, 0, result, 0, declaredMethods.length);
                    int index = declaredMethods.length;

                    for (Iterator var6 = defaultMethods.iterator(); var6.hasNext(); ++index) {
                        Method defaultMethod = (Method) var6.next();
                        result[index] = defaultMethod;
                    }
                } else {
                    result = declaredMethods;
                }
                declaredMethodsCache.put(clazz, result.length == 0 ? EMPTY_METHOD_ARRAY : result);
            } catch (Throwable t) {
                throw new IllegalStateException("Failed to introspect Class [" + clazz.getName() + "] from ClassLoader [" + clazz.getClassLoader() + "]", t);
            }
        }
        return result.length != 0 && defensive ? result.clone() : result;
    }

    @Nullable
    public static List<Method> findConcreteMethodsOnInterfaces(Class<?> clazz) {
        List<Method> result = null;
        for (Class<?> ifc : clazz.getInterfaces()) {
            for (Method ifcMethod : ifc.getMethods()) {
                if (!Modifier.isAbstract(ifcMethod.getModifiers())) {
                    if (result == null) {
                        result = new ArrayList<>();
                    }
                    result.add(ifcMethod);
                }
            }
        }
        return result;
    }

    @Nullable
    public static Object invokeMethod(Method method, @Nullable Object target) {
        return invokeMethod(method, target, EMPTY_OBJECT_ARRAY);
    }

    @Nullable
    public static Object invokeMethod(Method method, @Nullable Object target, @Nullable Object... args) {
        try {
            return method.invoke(target, args);
        } catch (Exception e) {
            handleReflectionException(e);
            throw new IllegalStateException("Should never get here");
        }
    }
}