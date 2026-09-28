package com.abc.resume.system.service;

import com.abc.resume.core.page.PageResult;
import com.abc.resume.system.domain.dto.FileDTO;
import com.abc.resume.system.domain.entity.File;

public interface FileService {

    PageResult getFilePageWithUiParam(FileDTO fileDTO);

    void updateFile(FileDTO fileDTO);

    void saveFile(FileDTO fileDTO);

    void deleteFile(FileDTO fileDTO);

    File vaildAndGet(Long fileId);

}
