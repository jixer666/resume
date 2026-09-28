package com.abc.resume.system.service.oss;

import com.abc.resume.core.exception.GlobalException;
import com.abc.resume.enums.ExceptionEnum;
import com.abc.resume.system.domain.dto.OssFileDTO;
import com.abc.resume.system.domain.entity.File;
import com.abc.resume.system.utils.OssFileUtil;
import com.aliyun.oss.OSSClient;
import com.aliyun.oss.OSSClientBuilder;
import com.aliyun.oss.model.ObjectMetadata;
import com.aliyun.oss.model.PutObjectRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;

/**
 * @Author: LiJunXi
 * @Description:
 * @Date: 2025-08-24  14:37
 */
@Slf4j
@Service
@OssStrategy(OssEnum.ALIYUN)
public class ALiYunOssStrategy implements IOssStrategy {

    @Value("${oss.aliyun.end-point}")
    private String endpoint;

    @Value("${oss.aliyun.access-key-id}")
    private String accessKeyId;

    @Value("${oss.aliyun.access-key-secret}")
    private String accessKeySecret;

    @Value("${oss.aliyun.bucket-name}")
    private String bucketName;

    @Override
    public void saveFile(OssFileDTO file) {
        String extension = OssFileUtil.getFileExtension(file.getMultipartFile().getOriginalFilename());
        String filePath = OssFileUtil.getFileUploadPath(extension, file.getFileMd5());
        file.setFilePath(filePath);
        OSSClient ossClient = (OSSClient) new OSSClientBuilder().build(endpoint, accessKeyId, accessKeySecret);
        try {
            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentType(OssFileUtil.getMimeType(extension));
            metadata.setContentLength(file.getFileData().length);
            ossClient.putObject(new PutObjectRequest(bucketName, filePath, new ByteArrayInputStream(file.getFileData()), metadata));
        } catch (Exception e) {
            log.error("上传阿里云OSS文件出错，原因：{}", e.getMessage(), e);
            throw new GlobalException(ExceptionEnum.BIZ_EXCEPTION.getCode(), "上传文件出错");
        } finally {
            ossClient.shutdown();
        }
    }

    @Override
    public byte[] getFile(File fileEntity) {
        return new byte[0];
    }

    @Override
    public void deleteFile(File fileEntity) {

    }
}

