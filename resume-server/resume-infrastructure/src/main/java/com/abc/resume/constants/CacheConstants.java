package com.abc.resume.constants;

public class CacheConstants {

    public static final String SYSTEM_NAME = "resume:";

    public static final String LOGIN_TOKEN_KEY = "loginToken:%s";

    public static final String CAPTCHA_UUID = "captchaUuid:%s";
    public static final Long CAPTCHA_UUID_EXPIRE_TIME = 5L;

    public static final String EMAIL_UUID = "emailUuid:%s";
    public static final String EMAIL_RECHECK = "emailRecheck:%s";
    public static final Long EMAIL_UUID_EXPIRE_TIME = 5L;

    public static final String EMAIL_FORGET_PWD_UUID = "emailForgetPwdUuid:%s";
    public static final String EMAIL_FORGET_PWD_RECHECK = "emailForgetPwdRecheck:%s";
    public static final Long EMAIL_FORGET_PWD_UUID_EXPIRE_TIME = 5L;

    public static final String USER_CACHE_UID = "userId:%s";
    public static final Long USER_CACHE_EXPIRE_TIME = 1L;

    public static final String REPEAT_REQUEST = "repeatRequest:%s";
    public static final Long REPEAT_REQUEST_EXPIRE_TIME = 1L;

    // 玩家资料
    public static final String PLAYER_PROFILE = "playerProfile:%s";

    public static String getFinalKey(String key, Object ...values) {
        return String.format(SYSTEM_NAME + key, values);
    }





}
