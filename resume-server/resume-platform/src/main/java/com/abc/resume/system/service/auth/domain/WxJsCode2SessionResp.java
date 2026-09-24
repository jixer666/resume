package com.abc.resume.system.service.auth.domain;

import lombok.Data;

@Data
public class WxJsCode2SessionResp {

    private static final String successCode = "0";

    private String session_key;

    private String unionid;

    private String openid;

    private String errocode;

    private String errmsg;

    public boolean isSuccess() {
        return successCode.equals(errocode);
    }
}
