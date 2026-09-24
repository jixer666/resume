package com.abc.resume.util;

import cn.hutool.core.lang.Snowflake;
import cn.hutool.core.util.IdUtil;

public class IdUtils {

    private static final char[] BASE62 = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".toCharArray();
    private static final int BASE = BASE62.length;
    private static Snowflake snowflake = IdUtil.getSnowflake();

    public static Long getId() {
        return snowflake.nextId();
    }

    public static String getIdStr() {
        return encodeBase62(snowflake.nextId());
    }

    private static String encodeBase62(long value) {
        if (value == 0) {
            return String.valueOf(BASE62[0]);
        }
        boolean negative = value < 0;
        if (negative) {
            value = -value;
        }
        StringBuilder sb = new StringBuilder();
        while (value > 0) {
            sb.append(BASE62[(int) (value % BASE)]);
            value /= BASE;
        }
        if (negative) {
            sb.append('-');
        }
        return sb.reverse().toString();
    }
}