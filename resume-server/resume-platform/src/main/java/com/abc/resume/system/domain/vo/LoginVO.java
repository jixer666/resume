package com.abc.resume.system.domain.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginVO {

    private String token;

    /** token有效期（秒） */
    private Integer expiresIn;

}
