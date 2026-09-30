package com.abc.resume.system.service.impl;

import com.abc.resume.core.base.BaseService;
import com.abc.resume.core.exception.GlobalException;
import com.abc.resume.core.strategy.ServiceProvider;
import com.abc.resume.enums.ExceptionEnum;
import com.abc.resume.system.domain.dto.FileDTO;
import com.abc.resume.system.domain.dto.OssFileDTO;
import com.abc.resume.system.domain.dto.OssFileUploadDTO;
import com.abc.resume.system.domain.entity.File;
import com.abc.resume.system.domain.vo.FileVO;
import com.abc.resume.system.service.FileService;
import com.abc.resume.system.service.OssService;
import com.abc.resume.system.service.oss.IOssStrategy;
import com.abc.resume.system.service.oss.OssEnum;
import com.abc.resume.system.utils.OssFileUtil;
import com.abc.resume.system.utils.SecurityUtils;
import com.abc.resume.util.AssertUtils;
import com.abc.resume.util.BeanUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

/**
 * @Author: LiJunXi
 * @Description:
 * @Date: 2025-08-22  21:34
 */
@Slf4j
@Service
public class OssServiceImpl extends BaseService implements OssService {

    @Autowired
    private FileService fileService;

    @Autowired
    private ServiceProvider serviceProvider;

    @Value("${oss.type}")
    private Integer ossType;

    @Override
    public FileVO uploadOss(OssFileUploadDTO req) {
        log.info("开始上传文件, MD5: {}", req.getFileMd5());
        // 保存到OSS
        File saveFile = buildNewFileByReq(req, ossType);
        OssFileDTO ossFile = buildOssFileDTO(saveFile, req.getFile());
        log.info("开始上传OSS文件，文件: {}", ossFile);
        saveToOss(ossFile);
        // 保存到数据库
        saveFile.setFilePath(ossFile.getFilePath());
        log.info("开始文件保存数据库，文件: {}", saveFile);
        fileService.saveFile(BeanUtils.copyProperties(saveFile, FileDTO.class));
        String downloadUrl = OssFileUtil.getFileDownloadUrl(saveFile.getId());
        log.info("文件上传成功，文件下载链接: {}", downloadUrl);
        return buildFileVO(saveFile, downloadUrl);
    }

    @Override
    public ResponseEntity<byte[]> downloadOss(Long fileId) {
        File fileEntity = fileService.vaildAndGet(fileId);
        byte[] fileData = downloadByOss(fileEntity);
        return download(fileData, fileEntity.getFilename(), MediaType.APPLICATION_OCTET_STREAM);
    }

    private void saveToOss(OssFileDTO ossFile) {
        IOssStrategy ossStrategy = getOssStrategy();
        ossStrategy.saveFile(ossFile);
    }

    private byte[] downloadByOss(File file) {
        IOssStrategy ossStrategy = getOssStrategy();
        return ossStrategy.getFile(file);
    }

    private IOssStrategy getOssStrategy() {
        OssEnum ossEnum = OssEnum.typeOf(ossType);
        IOssStrategy ossStrategy = serviceProvider.getService(ossEnum, IOssStrategy.class);
        AssertUtils.isNotEmpty(ossStrategy, ExceptionEnum.BIZ_EXCEPTION);
        return ossStrategy;
    }

    private File buildNewFileByReq(OssFileUploadDTO req, Integer ossType) {
        File fileEntity = BeanUtils.copyProperties(req, File.class);
        fileEntity.setOssType(ossType);
        fileEntity.setTotalSize(req.getFile().getSize());
        fileEntity.setUserId(SecurityUtils.getUserId());
        fileEntity.setFilename(req.getFile().getOriginalFilename());
        fileEntity.setCommonParams();
        return fileEntity;
    }


    private OssFileDTO buildOssFileDTO(File fileEntity, MultipartFile file) {
        OssFileDTO ossFileDto = BeanUtils.copyProperties(fileEntity, OssFileDTO.class);
        try {
            ossFileDto.setFileData(file.getBytes());
            ossFileDto.setMultipartFile(file);
        } catch (Exception e){
            log.error("创建OSSFileDto对象出错，原因：{}", e.getMessage());
            throw new GlobalException(ExceptionEnum.BIZ_EXCEPTION);
        }
        return ossFileDto;
    }

    private FileVO buildFileVO(File saveFile, String downloadUrl) {
        FileVO fileVo = BeanUtils.copyProperties(saveFile, FileVO.class);
        fileVo.setDownloadUrl(downloadUrl);
        return fileVo;
    }

}
