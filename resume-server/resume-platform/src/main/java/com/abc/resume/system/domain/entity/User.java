package com.abc.resume.system.domain.entity;

import com.abc.resume.core.base.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class User extends BaseEntity {

    private String uid;

    private String nickname;

    private String username;

    private String password;

    private String avatar;

    private String email;

    private String openid;

    private String ch;

}
