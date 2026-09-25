package com.abc.resume.core.base;

import com.abc.resume.constants.CommonConstants;
import com.abc.resume.enums.StatusEnum;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.io.Serializable;
import java.util.Date;

/**
 * Entity自定义基类
 */
@Data
public class BaseEntity implements Serializable {

    private Long id;

    /** 创建时间 */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date createTime;

    /** 更新时间 */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date updateTime;

    private Integer ver;

    private Integer status;

    // 未删除：创建时间，删除：主键ID
    private Long isDelete;

    public void setCommonParams() {
        Date now = new Date();
        this.setCreateTime(now);
        this.setUpdateTime(now);
        this.setStatus(StatusEnum.NORMAL.getStatus());
        this.setVer(CommonConstants.DEFAULT_VER);
        this.setIsDelete(now.getTime());
    }

}
