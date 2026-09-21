package com.abc.resume.util;

import cn.hutool.core.util.NumberUtil;

public class NumberUtils extends NumberUtil {

    /**
     * 字符串转 float，解析失败返回 0
     */
    public static float toFloat(String value) {
        try {
            return Float.parseFloat(value);
        } catch (NumberFormatException e) {
            return 0f;
        }
    }

    /**
     * 字符串转 short，解析失败返回 0
     */
    public static short toShort(String value) {
        try {
            return Short.parseShort(value);
        } catch (NumberFormatException e) {
            return 0;
        }
    }

    /**
     * 字符串转 byte，解析失败返回 0
     */
    public static byte toByte(String value) {
        try {
            return Byte.parseByte(value);
        } catch (NumberFormatException e) {
            return 0;
        }
    }

    /**
     * 字符串转 long，解析失败返回 0
     */
    public static long toLong(String value) {
        try {
            return Long.parseLong(value);
        } catch (NumberFormatException e) {
            return 0L;
        }
    }

    /**
     * 字符串转 double，解析失败返回 0
     */
    public static double toDouble(String value) {
        try {
            return Double.parseDouble(value);
        } catch (NumberFormatException e) {
            return 0D;
        }
    }

    /**
     * 字符串转 int，解析失败返回 0
     */
    public static int toInt(String value) {
        try {
            return Integer.parseInt(value);
        } catch (NumberFormatException e) {
            return 0;
        }
    }
}
