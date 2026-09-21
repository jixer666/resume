package com.abc.resume.security.context;

import org.springframework.security.core.Authentication;

public class SecurityAuthContext {

    private static ThreadLocal<Authentication> CONTEXT = new ThreadLocal<>();

    public static Authentication getContext() {
        return CONTEXT.get();
    }

    public static void setContext(Authentication authentication) {
        CONTEXT.set(authentication);
    }

    public static void removeContext() {
        CONTEXT.remove();
    }
}
