package com.abc.resume.system.domain.dto;

import lombok.Data;

import java.util.Date;
import java.util.List;

/**
 * 文件DTO对象
 *
 * @author LiJunXi
 * @date 2025-10-07
 */
@Data
public class FileDTO {

    private Long id;

    private String filename;

    private Long totalSize;

    private String fileType;

    private String fileMd5;

    private Integer ossType;

    private String filePath;

    private Long userId;

    private Date createTime;

    private Date updateTime;

    private Integer status;

    private Integer ver;

    // 用于批量删除
    private List<Long> fileIds;

}
