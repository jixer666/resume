package com.abc.resume.core.config.model;

import com.abc.resume.core.base.BaseEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Config extends BaseEntity {

    private String code;

    private String group;

    private String value;

}
