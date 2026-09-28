package com.abc.resume.system.domain.dto;

import com.abc.resume.system.domain.entity.File;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

/**
 * @Author: LiJunXi
 * @Description:
 * @Date: 2025-08-04  20:27
 */
@Data
public class OssFileDTO extends File {

    private byte[] fileData;

    private MultipartFile multipartFile;

}
