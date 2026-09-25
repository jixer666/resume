package com.abc.resume.resume.domain.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * @author LiJunXi
 * @date 2026/9/25
 */
@Getter
@AllArgsConstructor
public enum ResumeCategoryEnum {

    HOT(1, "热门");

    private int category;
    private String desc;

}
