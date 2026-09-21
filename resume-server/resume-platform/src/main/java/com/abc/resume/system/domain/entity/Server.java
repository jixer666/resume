package com.abc.resume.system.domain.entity;

import com.abc.resume.core.base.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class Server extends BaseEntity {

    private Long serverId;

    private String name;

}
