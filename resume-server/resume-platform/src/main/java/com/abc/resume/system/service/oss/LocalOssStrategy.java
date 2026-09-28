package com.abc.resume.system.service.oss;

import com.abc.resume.core.exception.GlobalException;
import com.abc.resume.enums.ExceptionEnum;
import com.abc.resume.system.domain.dto.OssFileDTO;
import com.abc.resume.system.domain.entity.File;
import com.abc.resume.system.utils.OssFileUtil;
import com.abc.resume.util.AssertUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

/**
 * @Author: LiJunXi
 * @Description:
 * @Date: 2025-08-24  14:37
 */
@Slf4j
@OssStrategy(OssEnum.LOCAL)
public class LocalOssStrategy implements IOssStrategy {

    @Value("${oss.local.path}")
    private String filePath;

    @Override
    public void saveFile(OssFileDTO file) {
        String extension = OssFileUtil.getFileExtension(file.getMultipartFile().getOriginalFilename());
        String filename = filePath + OssFileUtil.getFileUploadPath(extension, file.getFileMd5());
        try {
            java.io.File desc = new java.io.File(filename);
            if (!desc.exists()) {
                if (!desc.getParentFile().exists()) {
                    desc.getParentFile().mkdirs();
                }
            }
            file.getMultipartFile().transferTo(Paths.get(filename));
        } catch (Exception e) {
            log.error("上传文件出错：{}", e.getMessage());
            throw new GlobalException(ExceptionEnum.BIZ_EXCEPTION.getCode(), "上传文件出错");
        }
        file.setFilePath(filename);
    }

    @Override
    public byte[] getFile(File fileEntity) {
        java.io.File file = new java.io.File(fileEntity.getFilePath());
        AssertUtils.isTrue(file.exists(), ExceptionEnum.BIZ_EXCEPTION.getCode(), "文件已损坏");
        try {
            return Files.readAllBytes(file.toPath());
        } catch (IOException e) {
            log.error("读取文件失败：{}", e.getMessage());
            throw new GlobalException(ExceptionEnum.BIZ_EXCEPTION.getCode(), "读取文件失败");
        }
    }

    @Override
    public void deleteFile(File fileEntity) {
        java.io.File file = new java.io.File(fileEntity.getFilePath());
        AssertUtils.isTrue(file.exists(), ExceptionEnum.BIZ_EXCEPTION.getCode(), "文件已损坏");
        file.delete();
    }
}

