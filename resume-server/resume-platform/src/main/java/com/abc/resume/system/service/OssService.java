package com.abc.resume.system.service;

import com.abc.resume.system.domain.dto.OssFileUploadDTO;
import com.abc.resume.system.domain.vo.FileVO;
import org.springframework.http.ResponseEntity;

public interface OssService {

    FileVO uploadOss(OssFileUploadDTO req);

    ResponseEntity<byte[]> downloadOss(Long fileId);

}
