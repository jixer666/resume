package com.abc.resume.system.service.auth.domain;

import lombok.Data;

import java.util.Objects;

@Data
public class WxJsCode2SessionResp {

    private String session_key;

    private String unionid;

    private String openid;

    private String errocode;

    private String errmsg;

    public boolean isSuccess() {
        return Objects.isNull(errocode);
    }
}
