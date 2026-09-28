package com.abc.resume.system.domain.entity;

import com.abc.resume.core.base.BaseEntity;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 文件实体
 *
 * @author LiJunXi
 * @date 2025-10-07
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class File extends BaseEntity {

    @ApiModelProperty("文件名称")
    private String filename;

    @ApiModelProperty("文件大小")
    private Long totalSize;

    @ApiModelProperty("文件类型")
    private String fileType;

    @ApiModelProperty("文件MD5")
    private String fileMd5;

    @ApiModelProperty("OSS类型")
    private Integer ossType;

    @ApiModelProperty("文件路径")
    private String filePath;

    @ApiModelProperty("用户ID")
    private String userId;


}
