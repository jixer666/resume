package com.abc.resume.util;

import cn.hutool.http.HttpUtil;

public class HttpUtils extends HttpUtil {
    public static <T> T get(String url, Class<T> clazz, int timeout) {
        String respStr = get(url, timeout);
        if (StringUtils.isEmpty(respStr)) {
            return null;
        }
        return JsonUtils.toBean(respStr, clazz);
    }
}
