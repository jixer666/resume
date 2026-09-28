package com.abc.resume.system.service.oss;

import com.abc.resume.system.domain.dto.OssFileDTO;
import com.abc.resume.system.domain.entity.File;
import org.springframework.stereotype.Service;

/**
 * @Author: LiJunXi
 * @Description:
 * @Date: 2025-08-24  14:37
 */
@Service
@OssStrategy(OssEnum.ALIYUN)
public class ALiYunOssStrategy implements IOssStrategy {

    @Override
    public void saveFile(OssFileDTO file) {

    }

    @Override
    public byte[] getFile(File fileEntity) {
        return new byte[0];
    }

    @Override
    public void deleteFile(File fileEntity) {

    }
}

