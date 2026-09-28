package com.abc.resume.system.service.oss;

import cn.hutool.core.io.IoUtil;
import com.abc.resume.core.exception.GlobalException;
import com.abc.resume.enums.ExceptionEnum;
import com.abc.resume.system.domain.dto.OssFileDTO;
import com.abc.resume.system.domain.entity.File;
import com.abc.resume.system.utils.OssFileUtil;
import io.minio.GetObjectArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

import java.io.ByteArrayInputStream;
import java.io.InputStream;

@Slf4j
@OssStrategy(OssEnum.MINIO)
public class MinioOssStrategy implements IOssStrategy {

    @Autowired
    private MinioClient minioClient;

    @Value("${oss.minio.bucketName}")
    private String bucketName;

    @Override
    public void saveFile(OssFileDTO file) {
        String extension = OssFileUtil.getFileExtension(file.getMultipartFile().getOriginalFilename());
        String filePath = OssFileUtil.getFileUploadPath(extension, file.getFileMd5());
        file.setFilePath(filePath);
        try {
            PutObjectArgs putObjectArgs = PutObjectArgs.builder()
                    .object(filePath)
                    .bucket(bucketName)
                    .stream(new ByteArrayInputStream(file.getFileData()), file.getFileData().length, -1)
                    .contentType(OssFileUtil.getMimeType(extension))
                    .build();
            minioClient.putObject(putObjectArgs);
        } catch (Exception e) {
            log.error("上传OSS文件出错，原因：{}", e.getMessage(), e);
            throw new GlobalException(ExceptionEnum.BIZ_EXCEPTION.getCode(), "上传OSS文件出错");
        }
    }

    @Override
    public byte[] getFile(File fileEntity) {
        String filePath = fileEntity.getFilePath();
        try {
            InputStream inputStream = minioClient.getObject(
                    GetObjectArgs.builder()
                            .bucket(bucketName)
                            .object(filePath)
                            .build());
            return IoUtil.readBytes(inputStream);
        } catch (Exception e) {
            log.error("下载OSS文件出错，原因：{}", e.getMessage(), e);
            throw new GlobalException(ExceptionEnum.BIZ_EXCEPTION.getCode(), "下载OSS文件出错");
        }
    }

    @Override
    public void deleteFile(File fileEntity) {

    }
}
