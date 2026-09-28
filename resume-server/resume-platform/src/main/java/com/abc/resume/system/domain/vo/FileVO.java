package com.abc.resume.system.domain.vo;

import java.util.Date;
import lombok.Data;

/**
 * 文件VO对象
 *
 * @author LiJunXi
 * @date 2025-10-07
 */
@Data
public class FileVO {

    private Long id;

    private String filename;

    private String fileMd5;

    private String fileType;

    private Long totalSize;

    private String downloadUrl;

    private String filePath;

    private Integer ossType;

    private Long userId;

    private Date createTime;

    private Integer status;

}
