package com.abc.resume.system.service.oss;


import com.abc.resume.system.domain.dto.OssFileDTO;
import com.abc.resume.system.domain.entity.File;

public interface IOssStrategy {

    void saveFile(OssFileDTO file);

    byte[] getFile(File fileEntity);

    void deleteFile(File fileEntity);


}
