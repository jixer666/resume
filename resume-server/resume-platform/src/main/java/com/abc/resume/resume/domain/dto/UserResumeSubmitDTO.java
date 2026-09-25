package com.abc.resume.resume.domain.dto;

import lombok.Data;

/**
 * @author LiJunXi
 * @date 2026/9/25
 */
@Data
public class UserResumeSubmitDTO {

    public static final int ADD = 0;
    public static final int UPDATE = 1;
    public static final int DELTE = 2;

    private int act;

}
