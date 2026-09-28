package com.abc.resume.system.domain.dto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

/**
 * @Author: LiJunXi
 * @Description:
 * @Date: 2025-08-04  19:42
 */
@Data
public class OssFileUploadDTO {

    @NotNull(message = "文件不能为空")
    private MultipartFile file;

    @NotEmpty(message = "文件MD5不能为空")
    private String fileMd5;

    @NotEmpty(message = "文件类型不能为空")
    private String fileType;

}
